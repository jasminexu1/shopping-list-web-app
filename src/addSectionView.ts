import { ShoppingListModel } from "./model";
import { Observer } from "./observer";

export class AddSectionView implements Observer {
  private model: ShoppingListModel;
  private container: HTMLElement;
  private itemNameInput: HTMLInputElement;
  private itemQuantityInput: HTMLInputElement;
  private addItemBtn: HTMLButtonElement;
  private resetQuantityBtn: HTMLButtonElement;

  constructor(model: ShoppingListModel) {
    this.model = model;
    this.container = document.getElementById("add-section") as HTMLElement;
    this.container.innerHTML = "";

    this.itemNameInput = document.createElement("input");
    this.itemNameInput.type = "text";
    this.itemNameInput.id = "item-name";
    this.itemNameInput.placeholder = "Item Name";

    this.itemQuantityInput = document.createElement("input");
    this.itemQuantityInput.type = "number";
    this.itemQuantityInput.id = "item-quantity";
    this.itemQuantityInput.min = "1";
    this.itemQuantityInput.max = "24";
    this.itemQuantityInput.value = "1";

    this.resetQuantityBtn = document.createElement("button");
    this.resetQuantityBtn.id = "reset-quantity";
    this.resetQuantityBtn.textContent = "🔄";

    this.addItemBtn = document.createElement("button");
    this.addItemBtn.id = "add-item";
    this.addItemBtn.textContent = "➕";
    this.addItemBtn.disabled = true;

    this.container.appendChild(this.itemNameInput);
    this.container.appendChild(this.itemQuantityInput);
    this.container.appendChild(this.resetQuantityBtn);
    this.container.appendChild(this.addItemBtn);

    this.setupInputValidation();
    this.setupResetButton();
    this.setupAddButton();
    this.model.addObserver(this);
  }

  getElement(): HTMLElement {
    return this.container;
  }

  private setupInputValidation() {
    this.itemNameInput.addEventListener("input", () => {
      const isValid = /^[A-Za-z][A-Za-z ]*$/.test(this.itemNameInput.value);
      this.addItemBtn.disabled = !isValid;
    });
  }

  private setupResetButton() {
    this.resetQuantityBtn.disabled = this.itemQuantityInput.value === "1";
    this.resetQuantityBtn.addEventListener("click", () => {
      this.itemQuantityInput.value = "1";
      this.resetQuantityBtn.disabled = true;
    });

    this.itemQuantityInput.addEventListener("input", () => {
      this.resetQuantityBtn.disabled = this.itemQuantityInput.value === "1";
    });
  }

  private setupAddButton() {
    const addItem = () => {
      const name = this.itemNameInput.value;
      const quantity = parseInt(this.itemQuantityInput.value, 10);
      if (name && quantity > 0) {
        this.model.addItem(name, quantity);
      }
    };

    this.addItemBtn.addEventListener("click", addItem);
    this.itemNameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && this.addItemBtn.disabled === false) {
        addItem();
      }
    });
  }

  update() {
    const name = this.itemNameInput.value;
    if (this.model.hasItem(name)) {
      this.itemNameInput.value = "";
      this.itemQuantityInput.value = "1";
      this.addItemBtn.disabled = true;
      this.resetQuantityBtn.disabled = true;
    }
  }
}
