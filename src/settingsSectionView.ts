import { categories, ShoppingListModel } from "./model";
import { Observer } from "./observer";

export class SettingsSectionView implements Observer {
  private model: ShoppingListModel;
  private container: HTMLElement;

  constructor(model: ShoppingListModel) {
    this.model = model;
    this.container = document.getElementById("settings-section") as HTMLElement;
    this.initializeView();
    this.createEditOverlay();
    this.model.addObserver(this);
  }

  private initializeView() {
    this.container.innerHTML = "";

    const editCategoriesBtn = document.createElement("button");
    editCategoriesBtn.id = "edit-categories";
    editCategoriesBtn.textContent = "✍🏻 Edit Categories";
    editCategoriesBtn.style.width = "128px";

    const undoBtn = document.createElement("button");
    undoBtn.id = "undo";
    undoBtn.textContent = "↩️ Undo";
    undoBtn.style.width = "80px";

    const redoBtn = document.createElement("button");
    redoBtn.id = "redo";
    redoBtn.textContent = "↪️ Redo";
    redoBtn.style.width = "80px";

    const undoRedoContainer = document.createElement("div");
    undoRedoContainer.id = "undo-redo-container";
    undoRedoContainer.appendChild(undoBtn);
    undoRedoContainer.appendChild(redoBtn);

    this.container.appendChild(editCategoriesBtn);
    this.container.appendChild(undoRedoContainer);

    undoBtn.addEventListener("click", () => {
      this.model.undo();
      this.updateUndoRedoButtons();
    });

    redoBtn.addEventListener("click", () => {
      this.model.redo();
      this.updateUndoRedoButtons();
    });

    editCategoriesBtn.addEventListener("click", () => {
      const overlay = document.getElementById("edit-overlay");
      overlay?.classList.add("active");
    });

    this.updateUndoRedoButtons();
  }

  private updateUndoRedoButtons() {
    const undoBtn = document.getElementById("undo") as HTMLButtonElement;
    const redoBtn = document.getElementById("redo") as HTMLButtonElement;

    undoBtn.disabled = !this.model.canUndo;
    redoBtn.disabled = !this.model.canRedo;
  }

  private createEditOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "edit-overlay";
    overlay.classList.add("hidden");

    const panel = document.createElement("div");
    panel.id = "edit-panel";

    const title = document.createElement("h2");
    title.textContent = "✍🏻 Edit Categories";
    title.id = "edit-title";

    const classificationList = document.createElement("div");
    classificationList.id = "classification-list";

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "edit-buttons";

    const applyButton = document.createElement("button");
    applyButton.id = "apply-changes";
    applyButton.textContent = "✅ Apply";

    const cancelButton = document.createElement("button");
    cancelButton.id = "cancel-edit";
    cancelButton.textContent = "🚫 Cancel";

    buttonContainer.appendChild(applyButton);
    buttonContainer.appendChild(cancelButton);
    panel.appendChild(title);
    panel.appendChild(classificationList);
    panel.appendChild(buttonContainer);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    this.populateClassificationList();

    applyButton.addEventListener("click", () => {
      const categoryUpdates = new Map<string, string>();
      document.querySelectorAll(".classification-item").forEach((container) => {
        const dropdown = container.querySelector(
          ".classification-dropdown"
        ) as HTMLSelectElement;
        const itemName = container.getAttribute("data-item-name");
        if (itemName && dropdown.value) {
          categoryUpdates.set(itemName, dropdown.value);
        }
      });
      this.model.applyCategoryChanges(categoryUpdates);
      overlay.classList.remove("active");
    });

    cancelButton.addEventListener("click", () => {
      overlay.classList.remove("active");
    });

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        overlay.classList.remove("active");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("active")) {
        overlay.classList.remove("active");
      }
    });
  }

  getElement(): HTMLElement {
    return this.container;
  }

  private populateClassificationList() {
    const classificationList = document.getElementById("classification-list");
    if (classificationList) {
      classificationList.innerHTML = "";
      const classifications = this.model.getClassifications();
      classifications.forEach((category, itemName) => {
        const container = document.createElement("div");
        container.classList.add("classification-item");
        const label = document.createElement("span");
        label.textContent = itemName;
        label.classList.add("classification-label");
        const select = document.createElement("select");
        select.classList.add("classification-dropdown");
        container.setAttribute("data-item-name", itemName);
        categories.forEach((cat) => {
          const option = document.createElement("option");
          option.value = cat.name;
          option.textContent = `${cat.icon} ${cat.name}`;
          if (cat.name === category) option.selected = true;
          select.appendChild(option);
        });
        container.appendChild(label);
        container.appendChild(select);
        classificationList.appendChild(container);
      });
    }
  }

  private observeAllItems() {
    this.model.getItems().forEach((item) => {
      if (item.hasObserver(this) === false) {
        item.addObserver(this);
      }
    });
  }

  update() {
    this.updateUndoRedoButtons();
    this.populateClassificationList();
    this.observeAllItems();
  }
}
