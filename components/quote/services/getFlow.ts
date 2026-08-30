import { InsuranceType } from "../types";

import { autoFlow } from "../flows/autoFlow";
import { residentialFlow } from "../flows/residentialFlow";
import { lifeFlow } from "../flows/lifeFlow";
import { businessFlow } from "../flows/businessFlow";
import { healthFlow } from "../flows/healthFlow";
import { ruralFlow } from "../flows/ruralFlow";
import { travelFlow } from "../flows/travelFlow";

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

    case "Seguro Empresarial":
      return businessFlow;

    case "Seguro Saúde":
      return healthFlow;

    case "Seguro Rural":
      return ruralFlow;

    case "Seguro Viagem":
      return travelFlow;

    default:
      return autoFlow;
  }
}
