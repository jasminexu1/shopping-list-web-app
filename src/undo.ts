import { ShoppingItemModel, ShoppingListModel } from "./model";

export interface Command {
  redo(): void;
  undo(): void;
}

export class UndoManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  execute(command: Command) {
    this.undoStack.push(command);
    this.redoStack = [];
    command.redo();
  }

  undo() {
    const command = this.undoStack.pop();
    if (command) {
      this.redoStack.push(command);
      command.undo();
    }
  }

  redo() {
    const command = this.redoStack.pop();
    if (command) {
      this.undoStack.push(command);
      command.redo();
    }
  }

  get canUndo() {
    return this.undoStack.length > 0;
  }

  get canRedo() {
    return this.redoStack.length > 0;
  }
}

export class ChangeQuantityCommand implements Command {
  private item: ShoppingItemModel;
  private prevQuantity: number;
  private newQuantity: number;

  constructor(item: ShoppingItemModel, newQuantity: number) {
    this.item = item;
    this.prevQuantity = item.quantity;
    this.newQuantity = newQuantity;
  }

  redo() {
    this.item.quantity = this.newQuantity;
  }

  undo() {
    this.item.quantity = this.prevQuantity;
  }
}

export class AddItemCommand implements Command {
  private model: ShoppingListModel;
  private item: ShoppingItemModel;
  private name: string;
  private category: string;

  constructor(
    model: ShoppingListModel,
    name: string,
    quantity: number,
    category: string,
    undoManager: UndoManager
  ) {
    this.model = model;
    this.item = new ShoppingItemModel(
      name,
      quantity,
      category,
      false,
      undoManager
    );
    this.name = name;
    this.category = category;
  }

  redo() {
    this.model.getItems().push(this.item);
    this.model.getClassifications().set(this.name, this.category);
  }

  undo() {
    this.model.getItems().splice(this.model.getItems().indexOf(this.item), 1);
    this.model.getClassifications().delete(this.name);
  }
}

export class RemoveItemCommand implements Command {
  private model: ShoppingListModel;
  private item: ShoppingItemModel;
  private index: number;

  constructor(model: ShoppingListModel, item: ShoppingItemModel) {
    this.model = model;
    this.item = item;
    this.index = model.getItems().indexOf(item);
  }

  redo() {
    this.model.getItems().splice(this.index, 1);
  }

  undo() {
    this.model.getItems().splice(this.index, 0, this.item);
  }
}

export class ChangeCategoriesCommand implements Command {
  private model: ShoppingListModel;
  private prevCategories: Map<string, string>;
  private newCategories: Map<string, string>;

  constructor(model: ShoppingListModel, newCategories: Map<string, string>) {
    this.model = model;
    this.newCategories = new Map(newCategories);
    this.prevCategories = this.model.getClassifications();
  }

  redo() {
    this.newCategories.forEach((newCategory, name) => {
      this.model.getItems().forEach((item) => {
        if (item.name === name) {
          item.category = newCategory;
        }
      });
    });
    this.model.setClassifications(this.newCategories);
  }

  undo() {
    this.prevCategories.forEach((prevCategory, name) => {
      this.model.getItems().forEach((item) => {
        if (item.name === name) {
          item.category = prevCategory;
        }
      });
    });
    this.model.setClassifications(this.prevCategories);
  }
}

export class ToggleBoughtCommand implements Command {
  private item: ShoppingItemModel;
  private prevBought: boolean;

  constructor(item: ShoppingItemModel) {
    this.item = item;
    this.prevBought = item.bought;
  }

  redo() {
    this.item.bought = !this.prevBought;
  }

  undo() {
    this.item.bought = this.prevBought;
  }
}
