import { ShoppingListModel } from "./model";
import { AppView } from "./view";

document.addEventListener("DOMContentLoaded", () => {
  const model = new ShoppingListModel();
  new AppView(model);
});
