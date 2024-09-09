import ReactToPrint, {
  PrintContextConsumer,
  IReactToPrintProps,
} from "react-to-print";
import { GradientButton } from "components/styledComponent/button";
export interface DefaultChieldData {
  buttonText?: string;
}
type PrintAllProps = Merge<DefaultChieldData, IReactToPrintProps>;
export const PrintButton = ({
  content,
  buttonText = "Print",
  ...other
}: PrintAllProps) => {
  return (
    <ReactToPrint {...other} content={content}>
      <PrintContextConsumer>
        {({ handlePrint }) => (
          <GradientButton onClick={handlePrint}>{buttonText}</GradientButton>
        )}
      </PrintContextConsumer>
    </ReactToPrint>
  );
};
export type Merge<A, B> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K];
} & B extends infer O
  ? { [K in keyof O]: O[K] }
  : never;
