import { Observer } from "./observer";
import { ShoppingListModel, ShoppingItemModel, categories } from "./model";
import { ShoppingItemView } from "./shoppingItemView";

export class ListSectionView implements Observer {
  private model: ShoppingListModel;
  private container: HTMLElement;

  constructor(model: ShoppingListModel) {
    this.model = model;
    this.container = document.getElementById("list-section") as HTMLElement;
    this.model.addObserver(this);
  }

  getElement(): HTMLElement {
    return this.container;
  }

  update() {
    this.renderShoppingList();
  }

  private renderShoppingList() {
    this.container.innerHTML = "";
    const groupedItems: Record<string, ShoppingItemModel[]> = {};

    this.model.getItems().forEach((item) => {
      if (groupedItems[item.category] === undefined) {
        groupedItems[item.category] = [];
      }
      groupedItems[item.category].push(item);
    });

    categories
      .filter((category) => groupedItems[category.name])
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((category) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category-section");
        categoryDiv.id = `category-${category.name}`;
        categoryDiv.style.backgroundColor = category.colour;

        const header = document.createElement("div");
        header.classList.add("category-header");
        header.textContent = `${category.icon} ${category.name}`;
        categoryDiv.appendChild(header);

        this.container.appendChild(categoryDiv);

        const computedHeaderColor = getComputedStyle(header).backgroundColor;
        categoryDiv.style.borderLeft = `4px solid ${computedHeaderColor}`;

        groupedItems[category.name]
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((item) => {
            const itemView = new ShoppingItemView(item);
            categoryDiv.appendChild(itemView.getElement());
            itemView.getRemoveBtn().addEventListener("click", () => {
              this.model.removeItem(item);
            });
          });
      });
  }
}
