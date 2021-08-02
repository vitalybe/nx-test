import { TopBarSearchOptionModel } from "src/topBar/topBarSearch/_parts/topBarSearchOption/topBarSearchOptionModel";

export class TopBarSearchGroup {
  constructor(public name: string, public options: TopBarSearchOptionModel[]) {}
}
