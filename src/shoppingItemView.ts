import { ShoppingItemModel } from "./model";
import { Observer } from "./observer";

function truncateText(text: string): string {
  if (text.length > 30) {
    return text.slice(0, 30) + "...";
  } else {
    return text;
  }
}

export class ShoppingItemView implements Observer {
  private model: ShoppingItemModel;
  private element: HTMLElement;
  private checkbox: HTMLInputElement;
  private nameLabel: HTMLSpanElement;
  private stepper: HTMLInputElement;
  private resetBtn: HTMLButtonElement;
  private removeBtn: HTMLButtonElement;
  private controlsDiv: HTMLElement;

  constructor(model: ShoppingItemModel) {
    this.model = model;
    this.element = document.createElement("div");
    this.element.classList.add("shopping-item");

    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.checked = this.model.bought;
    this.checkbox.addEventListener("change", () => {
      this.model.toggleBought();
    });

    this.nameLabel = document.createElement("span");
    this.nameLabel.classList.add("shopping-item-label");
    this.nameLabel.textContent = truncateText(this.model.name);

    this.stepper = document.createElement("input");
    this.stepper.type = "number";
    this.stepper.min = "1";
    this.stepper.max = "24";
    this.stepper.value = this.model.quantity.toString();
    this.stepper.addEventListener("input", () => {
      this.model.updateQuantity(parseInt(this.stepper.value, 10) || 1);
    });

    this.resetBtn = document.createElement("button");
    this.resetBtn.textContent = "🔄";
    this.resetBtn.disabled = this.model.quantity === 1;
    this.resetBtn.addEventListener("click", () => {
      this.model.updateQuantity(1);
    });

    this.removeBtn = document.createElement("button");
    this.removeBtn.textContent = "🗑️";
    this.removeBtn.addEventListener("click", () => {
      this.element.remove();
    });

    this.controlsDiv = document.createElement("div");
    this.controlsDiv.classList.add("controls");
    this.controlsDiv.appendChild(this.stepper);
    this.controlsDiv.appendChild(this.resetBtn);
    this.controlsDiv.appendChild(this.removeBtn);

    this.element.appendChild(this.checkbox);
    this.element.appendChild(this.nameLabel);
    this.element.appendChild(this.controlsDiv);

    this.model.addObserver(this);
    this.update();
  }

  update() {
    const itemBought = this.model.bought;
    this.checkbox.checked = itemBought;
    this.stepper.value = this.model.quantity.toString();
    this.resetBtn.disabled = this.model.quantity === 1;
    if (itemBought) {
      this.nameLabel.style.color = "dimgray";
      this.nameLabel.style.textDecoration = "line-through";
      this.stepper.style.display = "none";
      this.resetBtn.style.display = "none";
    } else {
      this.nameLabel.style.color = "black";
      this.nameLabel.style.textDecoration = "none";
      this.stepper.style.display = "inline-block";
      this.resetBtn.style.display = "inline-block";
    }
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getRemoveBtn(): HTMLElement {
    return this.removeBtn;
  }
}
