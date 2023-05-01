import { Engine } from "json-rules-engine";
import { TopLevelCondition } from "json-rules-engine";
import { FormFieldAtomType, DependentValuesType } from "packages/form";
import {
  greaterThanString,
  greaterThanInclusiveString,
  lessThanInclusiveString,
  lessThanString,
  greaterThanInclusiveDate,
  geaterThanDate,
  lessThanDate,
  lessThanInclusiveDate,
} from "registry/rulesEngine";

export interface CustomRuleType {
  conditions: TopLevelCondition;
  success: any;
  failure: any;
}

export const ruleEngine =
  (rule: CustomRuleType) =>
  async (
    fieldData: FormFieldAtomType,
    dependentFields: DependentValuesType
  ) => {
    const { success, failure, conditions } = rule;
    let engine = new Engine();
    engine.addOperator("greaterThanInclusiveDate", greaterThanInclusiveDate);
    engine.addOperator("geaterThanDate", geaterThanDate);
    engine.addOperator("lessThanDate", lessThanDate);
    engine.addOperator("lessThanInclusiveDate", lessThanInclusiveDate);
    engine.addOperator("greaterThanString", greaterThanString);
    engine.addOperator(
      "greaterThanInclusiveString",
      greaterThanInclusiveString
    );
    engine.addOperator("lessThanInclusiveString", lessThanInclusiveString);
    engine.addOperator("lessThanString", lessThanString);
    const extendRule = {
      conditions: conditions,
      event: {
        type: "success",
      },
    };
    engine.addRule(extendRule);
    const result = await engine.run({
      currentField: fieldData,
      dependentFields,
    });

    engine.stop();
    // console.log(">>result", result);
    if (result.events.length > 0) {
      return success;
    } else {
      return failure;
    }
  };

// //sample Condition block
// const x = {
//   conditions: {
//     all: [
//       {
//         fact: "dependentFields",
//         path: "$.age.value",
//         operator: "lessThanInclusive",
//         value: {
//           fact: "dependentFields",
//           path: "$.maxAge.value",
//         },
//       },
//     ],
//   },
//   success: "YESSSS",
//   failure: "No",
// };
