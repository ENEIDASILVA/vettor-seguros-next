import { InsuranceType } from "../types";

import { autoFlow } from "../flows/autoFlow";
import { residentialFlow } from "../flows/residentialFlow";
import { lifeFlow } from "../flows/lifeFlow";

export function getFlow(
  insuranceType: InsuranceType | ""
) {
  switch (insuranceType) {
    case "Seguro Auto":
      return autoFlow;

    case "Seguro Residencial":
      return residentialFlow;

    case "Seguro de Vida":
      return lifeFlow;

    default:
      return autoFlow;
  }
}