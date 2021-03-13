import { BrewService } from './../../_services/brew/brew.service';
import { Brew, BrewIngredient, Ingredient, IngredientStock, Order } from '@app/_models';
import { ValueViewChild } from '@app/_services';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { StockService } from '@app/_services/stock/stock.service';
import { SimpleChange, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

export class OrderDetailCreation {
  ingredientsByType = new Array<IngredientsByType>();
  brewsDetail = new Array<BrewDetail>();
  order: Order;
  public constructor(
    public ingredientService: IngredientService,
    public stockService: StockService,
    public brewService: BrewService
  ) {

  }

  public init(order: Order) {
    this.order = order;
    this.order.stocks.forEach(stock => {
      const childName = this.ingredientService.ingredientChildrenNames.find(x => x.value === stock.ingredient.childName);
      const indexAccordion = this.ingredientsByType.findIndex(x => x.childName.value === childName.value);
      if (indexAccordion < 0) {
        const accordion = new IngredientsByType(childName, this.stockService, this.order);
        accordion.addStockOrder(stock);
        this.ingredientsByType.push(accordion);
      } else {
        const accordion = this.ingredientsByType[indexAccordion];
        accordion.addStockOrder(stock);
      }
    });
    this.brewService.model.forEach(brew => {
      const brewDetail = new BrewDetail(brew);
      this.brewsDetail.push(brewDetail);
      if (brew.state === 'planed') {
        this.addBrewDetail(brewDetail);
      } else {
        brewDetail.isApply = false;
      }
    });
  }

  public updateIngredientStock(change: SimpleChange) {
    if (change.previousValue && !change.previousValue[`id`]) {
      // C'est un ajout. Sinon c'est un update et ça devrait être bon par le process de IService.
      const indexAcc = this.ingredientsByType.findIndex(x => x.childName.value === change.previousValue.ingredient.childName);
      if (indexAcc >= 0) {
        const row = this.ingredientsByType[indexAcc];
        const indexRow = row.orderStocks.findIndex(x => x.ingredient.id === change.previousValue.ingredient.id);
        if (indexRow >= 0) {
          const orderStock = row.orderStocks[indexRow];
          let index = orderStock.orderStocks.findIndex(x => x === change.previousValue);
          if (index < 0) { index = orderStock.orderStocks.findIndex(x => !x.id); }
          if (index >= 0) {
            orderStock.orderStocks[index] = change.currentValue;
          }
        }
      }
      const orderIndex = this.order.stocks.findIndex(x => x === change.previousValue);
      if (orderIndex >= 0) {
        this.order.stocks[orderIndex] = change.currentValue;
      } else {
        this.order.stocks.push(change.currentValue);
      }
    } else if (change.previousValue && change.previousValue[`id`]
      && (change.currentValue === null || change.currentValue === undefined)) {
      const orderIndex = this.order.stocks.findIndex(x => x === change.previousValue);
      if (orderIndex >= 0) {
        this.order.stocks.splice(orderIndex, 1);
      }
    }
  }

  public addBrewDetail(brewDetail: BrewDetail) {
    brewDetail.brew.brewIngredients.forEach(brewIngredient => {
      let indexAccordion = this.ingredientsByType.findIndex(x => x.childName.value === brewIngredient.ingredient.childName);
      if (indexAccordion < 0) {
        const childname = this.ingredientService.ingredientChildrenNames.find(x => x.value === brewIngredient.ingredient.childName);
        const accordion = new IngredientsByType(childname, this.stockService, this.order);
        const stock = new IngredientStock(undefined);
        stock.init(brewIngredient.ingredient, this.order);
        accordion.addStockOrder(stock);
        this.ingredientsByType.push(accordion);
        indexAccordion = this.ingredientsByType.length - 1;
      }
      this.ingredientsByType[indexAccordion].addBrewIngredient(brewIngredient, brewDetail);
    });
  }

  public removeBrewDetail() {
    for (let i = this.ingredientsByType.length - 1; i >= 0; i--) {
      this.ingredientsByType[i].removeBrewsDetail();
      if (this.ingredientsByType[i].orderStocks.length === 0) {
        this.ingredientsByType.splice(i, 1);
      }
    }
    this.brewsDetail.forEach(brewDetail => {
      brewDetail.clearIngredients();
      if (brewDetail.isApply) {
        this.addBrewDetail(brewDetail);
      }
    });
  }
}



export class BrewDetail {
  brew: Brew;
  isApply: boolean;
  canBeBrew: boolean;
  ingredients = new Array<BrewIngredientOrder>();
  constructor(brew: Brew) {
    this.brew = brew;
    this.isApply = true;
    this.canBeBrew = true;
  }
  clearIngredients() {
    this.ingredients.splice(0, this.ingredients.length);
    this.canBeBrew = true;
  }
  addIngredient(ingredient: BrewIngredientOrder) {
    this.ingredients.push(ingredient);
  }

  ingredientBecomeOk() {
    let canBrew = true;
    this.ingredients.forEach(ing => {
      if (ing.quantityLeft > 0) {
        this.canBeBrew = false;
        canBrew = false;
      }
    });
    if (canBrew) { this.canBeBrew = true; }
  }

  ingredientWillMiss() {
    this.canBeBrew = false;
  }
}

export class BrewIngredientOrder {
  brewIngredient: BrewIngredient;
  quantityLeft: number;
  brewDetail: BrewDetail;

  public constructor(brewIngredient: BrewIngredient, quantityLeft: number, brewDetail: BrewDetail) {
    this.brewIngredient = brewIngredient;
    if (quantityLeft >= brewIngredient.quantity) {
      this.quantityLeft = 0;
    } else if (quantityLeft >= 0) {
      this.quantityLeft = brewIngredient.quantity - quantityLeft;
    } else {
      this.quantityLeft = brewIngredient.quantity;
    }
    this.brewDetail = brewDetail;
    brewDetail.addIngredient(this);
  }
}

export class IngredientsByType {
  childName: ValueViewChild;
  orderStocks = new Array<OrderStock>();
  orderStocksUpdate = new EventEmitter<boolean>();
  stockService: StockService;
  order: Order;
  expanded = false;
  public constructor(
    childName: ValueViewChild,
    stockService: StockService,
    order: Order
  ) {
    this.childName = childName;
    this.stockService = stockService;
    this.order = order;
  }

  public addStockOrder(stock: IngredientStock) {
    const index = this.orderStocks.findIndex(x => x.ingredient.id === stock.ingredient.id);
    if (index < 0) {
      const orderStock = new OrderStock(stock.ingredient, this.order, stock, this.stockService);
      this.orderStocks.push(orderStock);
    } else {
      this.orderStocks[index].addOrderStock(stock);
    }
  }

  public addBrewIngredient(brewIngredient: BrewIngredient, brewDetail: BrewDetail) {
    let index = this.orderStocks.findIndex(x => x.ingredient.id === brewIngredient.ingredient.id);
    if (index < 0) {
      const orderStock = new OrderStock(brewIngredient.ingredient, this.order, undefined, this.stockService);
      this.orderStocks.push(orderStock);
      index = this.orderStocks.length - 1;
      this.orderStocksUpdate.emit(true);
    }
    this.orderStocks[index].addBrewIngredient(brewIngredient, brewDetail);
    if (this.orderStocks[index].expanded) {
      this.expanded = true;
    }
  }

  public removeBrewsDetail() {
    let toEmit = false;
    for (let i = this.orderStocks.length - 1; i >= 0; i--) {
      this.orderStocks[i].removeBrewsDetail();
      if (this.orderStocks[i].orderStocks.length === 0) {
        toEmit = true;
        this.orderStocks.splice(i, 1);
      }
    }
    if (this.orderStocks.length === 0) { this.expanded = false; }
    if (toEmit) {
      this.orderStocksUpdate.emit(true);
    }
  }
}

export class OrderStock {
  order: Order;
  ingredient: Ingredient;
  orderStocks = new Array<IngredientStock>();
  inStocks = new Array<IngredientStock>();
  inOrders = new Array<IngredientStock>();
  quantityInStock = 0;
  quantityNeeded = 0;
  quantityRecommanded = 0;
  /**
   * La quantité totale commandée.
   */
  quantityOrder = 0;
  /**
   * La date de livraison la plus lointaine.
   */
  lastDeliverySchedule = new Date(1, 1, 1);
  brewIngredients = new Array<BrewIngredientOrder>();
  brewIngredientsUpdate = new EventEmitter<boolean>();
  stockService: StockService;
  expanded = false;
  public constructor(ingredient: Ingredient, order: Order, stock: IngredientStock, stockService: StockService) {
    this.ingredient = ingredient;
    this.order = order;
    this.addOrderStock(stock);
    this.stockService = stockService;
    const stocks = this.stockService.model.filter(x => x.ingredient.id === this.ingredient.id);
    stocks.forEach(inStock => {
      if (inStock.state === 'stocked') {
        this.inStocks.push(inStock);
        this.quantityInStock += inStock.quantity;
      }
      if (inStock.state === 'ordered') {
        this.inOrders.push(inStock);
      }
    });
  }

  public addOrderStock(stock: IngredientStock) {
    if (stock === undefined) {
      stock = new IngredientStock(undefined);
      stock.init(this.ingredient, this.order);
    }
    if (!stock.quantity) { stock.quantity = 0; }
    this.quantityOrder += stock.quantity;
    if (stock.deliveryScheduledFor > this.lastDeliverySchedule) {
      this.lastDeliverySchedule = stock.deliveryScheduledFor;
    }
    this.orderStocks.push(stock);
  }

  public removeBrewsDetail() {
    this.brewIngredients.splice(0, this.brewIngredients.length);
    if (this.orderStocks.length === 1 && this.orderStocks[0].id === undefined) {
      this.orderStocks.splice(0, 1);
    }
    this.quantityNeeded = 0;
    this.quantityRecommanded = 0;
    this.brewIngredientsUpdate.emit(false);
  }
  public addBrewIngredient(brewIngredient: BrewIngredient, brewDetail: BrewDetail) {
    const index = this.brewIngredients.findIndex(c => c.brewIngredient.id === brewIngredient.id);
    if (index >= 0) {
      return;
    }
    let quantityOrder = 0;
    let quantityInOrder = 0;

    this.orderStocks.forEach(stock => {
      if (stock.deliveryScheduledFor === undefined || stock.deliveryScheduledFor === null) {
        quantityOrder += stock.quantity;
      } else if (stock.deliveryScheduledFor < brewIngredient.brew.started) {
        quantityOrder += stock.quantity;
      }
    });
    this.inOrders.forEach(stock => {
      if (stock.deliveryScheduledFor === undefined || stock.deliveryScheduledFor === null) {
        quantityInOrder += stock.quantity;
      } else if (stock.deliveryScheduledFor < brewIngredient.brew.started) {
        quantityInOrder += stock.quantity;
      }
    });

    this.brewIngredients.push(
      new BrewIngredientOrder(
        brewIngredient,
        (this.quantityInStock + quantityOrder + quantityInOrder) - this.quantityNeeded,
        brewDetail
      ));
    this.quantityNeeded += brewIngredient.quantity;
    if (this.quantityInStock + quantityInOrder > this.quantityNeeded) { this.quantityRecommanded = 0; }
    else if (this.quantityInStock + quantityInOrder > 0 && this.quantityNeeded > this.quantityInStock + quantityInOrder) {
      this.quantityRecommanded = this.quantityNeeded - (this.quantityInStock + quantityInOrder);
    } else {
      this.quantityRecommanded = this.quantityNeeded;
    }
    if (this.brewIngredients[this.brewIngredients.length - 1].quantityLeft > 0) {
      this.expanded = true;
      this.brewIngredients[this.brewIngredients.length - 1].brewDetail.ingredientWillMiss();
    }
    this.brewIngredientsUpdate.emit(true);
  }

  public updateQuantity(iStock: IngredientStock, quantity: number) {
    if (iStock && quantity >= 0) {
      this.quantityOrder += quantity - iStock.quantity;
      iStock.quantity = quantity;
    }
    let quantityUsed = 0;
    let scheduleFor = new Date(1, 1, 1);
    this.brewIngredients.forEach(brewIngredient => {
      let quantityOrder = 0;
      this.orderStocks.forEach(stock => {
        if (stock.deliveryScheduledFor === undefined || stock.deliveryScheduledFor === null) {
          quantityOrder += stock.quantity;
        } else if (stock.deliveryScheduledFor < brewIngredient.brewIngredient.brew.started) {
          quantityOrder += stock.quantity;
        }
        if (scheduleFor < stock.deliveryScheduledFor) {
          scheduleFor = stock.deliveryScheduledFor;
        }
      });
      if (this.lastDeliverySchedule !== scheduleFor && scheduleFor !== new Date()) { this.lastDeliverySchedule = scheduleFor; }
      this.inOrders.forEach(stock => {
        if (stock.deliveryScheduledFor === undefined || stock.deliveryScheduledFor === null) {
          // On ne fait rien lorsque la date de livraison est indéfinie.
          // quantityOrder += stock.quantity;
        } else if (stock.deliveryScheduledFor < brewIngredient.brewIngredient.brew.started) {
          quantityOrder += stock.quantity;
        }
      });
      let quantityLeft = brewIngredient.brewIngredient.quantity;
      if (quantityOrder + this.quantityInStock - quantityUsed >= quantityLeft) {
        quantityUsed += quantityLeft;
        quantityLeft = 0;
      } else {
        quantityLeft -= (quantityOrder + this.quantityInStock - quantityUsed);
        quantityUsed += brewIngredient.brewIngredient.quantity - quantityLeft;
      }
      if (quantityLeft !== brewIngredient.quantityLeft) {
        let notifyBrewMissing = false;
        let notifyBrewIngOk = false;
        if (quantityLeft > 0 && brewIngredient.quantityLeft === 0) {
          notifyBrewMissing = true;
        } else if (quantityLeft === 0 && brewIngredient.quantityLeft > 0) {
          notifyBrewIngOk = true;
        }
        brewIngredient.quantityLeft = quantityLeft;
        if (notifyBrewIngOk) {
          brewIngredient.brewDetail.ingredientBecomeOk();
        } else if (notifyBrewMissing) {
          brewIngredient.brewDetail.ingredientWillMiss();
        }
      }
    });
  }
}
