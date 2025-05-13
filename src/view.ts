import { ShoppingListModel } from "./model";
import { SettingsSectionView } from "./settingsSectionView";
import { AddSectionView } from "./addSectionView";
import { ListSectionView } from "./listSectionView";

export class AppView {
  private model: ShoppingListModel;
  private app: HTMLElement;
  private settingsView: SettingsSectionView;
  private addView: AddSectionView;
  private listView: ListSectionView;

  constructor(model: ShoppingListModel) {
    this.model = model;
    this.app = document.getElementById("app") as HTMLElement;

    this.settingsView = new SettingsSectionView(this.model);
    this.addView = new AddSectionView(this.model);
    this.listView = new ListSectionView(this.model);

    this.initializeView();
  }

  private initializeView() {
    this.app.innerHTML = "";
    this.app.appendChild(this.settingsView.getElement());
    this.app.appendChild(this.addView.getElement());
    this.app.appendChild(this.listView.getElement());
  }
}
