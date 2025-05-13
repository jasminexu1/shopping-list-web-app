import { Subject } from "./observer";
import {
  AddItemCommand,
  ChangeCategoriesCommand,
  ChangeQuantityCommand,
  RemoveItemCommand,
  ToggleBoughtCommand,
  UndoManager,
} from "./undo";

export type Category = {
  icon: string;
  name: string;
  colour: string;
};

export class ShoppingItemModel extends Subject {
  name: string;
  quantity: number;
  category: string;
  bought: boolean;
  private undoManager: UndoManager;

  constructor(
    name: string,
    quantity: number,
    category: string,
    bought: boolean,
    undoManager: UndoManager
  ) {
    super();
    this.name = name;
    this.quantity = quantity;
    this.category = category;
    this.bought = bought;
    this.undoManager = undoManager;
  }

  updateQuantity(newQuantity: number) {
    this.undoManager.execute(new ChangeQuantityCommand(this, newQuantity));
    this.notifyObservers();
  }

  toggleBought() {
    this.undoManager.execute(new ToggleBoughtCommand(this));
    this.notifyObservers();
  }
}

export const categories: Category[] = [
  { icon: "🥛", name: "Dairy", colour: `hsl(220, 75%, 75%)` },
  { icon: "🧊", name: "Frozen", colour: `hsl(220, 90%, 95%)` },
  { icon: "🍌", name: "Fruit", colour: `hsl(140, 75%, 75%)` },
  { icon: "🛒", name: "Other", colour: `hsl(0, 0%, 90%)` },
];

export const sampleItems: ShoppingItemModel[] = [
  new ShoppingItemModel("Milk", 4, "Dairy", false, new UndoManager()),
  new ShoppingItemModel("Yogurt", 1, "Dairy", false, new UndoManager()),
  new ShoppingItemModel("Pizza", 1, "Frozen", false, new UndoManager()),
  new ShoppingItemModel("Eggs", 12, "Other", false, new UndoManager()),
  new ShoppingItemModel("Olive Oil", 1, "Other", false, new UndoManager()),
  new ShoppingItemModel("Cheese", 1, "Dairy", false, new UndoManager()),
  new ShoppingItemModel("Burritos", 4, "Frozen", false, new UndoManager()),
  new ShoppingItemModel("Waffles", 2, "Frozen", false, new UndoManager()),
  new ShoppingItemModel("Bananas", 6, "Fruit", false, new UndoManager()),
  new ShoppingItemModel("Apples", 3, "Fruit", false, new UndoManager()),
  new ShoppingItemModel("Oranges", 3, "Fruit", false, new UndoManager()),
];

export class ShoppingListModel extends Subject {
  private shoppingList: ShoppingItemModel[];
  private itemClassifications: Map<string, string> = new Map();
  private undoManager = new UndoManager();

  constructor() {
    super();
    this.shoppingList = [...sampleItems]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(
        (item) =>
          new ShoppingItemModel(
            item.name,
            item.quantity,
            item.category,
            item.bought,
            this.undoManager
          )
      );
    this.shoppingList.forEach((item) =>
      this.itemClassifications.set(item.name, item.category)
    );
  }

  getItems(): ShoppingItemModel[] {
    return this.shoppingList;
  }

  addItem(name: string, quantity: number) {
    const existingItem = this.shoppingList.find((item) => item.name === name);
    if (existingItem) {
      this.undoManager.execute(
        new ChangeQuantityCommand(
          existingItem,
          existingItem.quantity + quantity
        )
      );
    } else {
      let category = this.itemClassifications.get(name) || "Other";
      this.undoManager.execute(
        new AddItemCommand(this, name, quantity, category, this.undoManager)
      );
    }
    this.notifyObservers();
  }

  removeItem(item: ShoppingItemModel) {
    this.undoManager.execute(new RemoveItemCommand(this, item));
    this.notifyObservers();
  }

  getClassifications() {
    return this.itemClassifications;
  }

  setClassifications(classification: Map<string, string>) {
    this.itemClassifications = classification;
  }

  applyCategoryChanges(categoryUpdates: Map<string, string>) {
    let hasUpdate = false;
    categoryUpdates.forEach((newCategory, name) => {
      const prevCategory = this.itemClassifications.get(name);
      if (prevCategory && prevCategory !== newCategory) {
        hasUpdate = true;
      }
    });

    if (hasUpdate) {
      this.undoManager.execute(
        new ChangeCategoriesCommand(this, categoryUpdates)
      );
      this.notifyObservers();
    }
  }

  toggleItemBought(item: ShoppingItemModel) {
    this.undoManager.execute(new ToggleBoughtCommand(item));
    this.notifyObservers();
  }

  updateItemQuantity(item: ShoppingItemModel, newQuantity: number) {
    this.undoManager.execute(new ChangeQuantityCommand(item, newQuantity));
    this.notifyObservers();
  }

  hasItem(name: string): boolean {
    const existingItem = this.shoppingList.find((item) => item.name === name);
    if (existingItem) {
      return true;
    }
    return false;
  }

  undo() {
    this.undoManager.undo();
    this.notifyObservers();
  }

  redo() {
    this.undoManager.redo();
    this.notifyObservers();
  }

  get canUndo() {
    return this.undoManager.canUndo;
  }

  get canRedo() {
    return this.undoManager.canRedo;
  }
}
