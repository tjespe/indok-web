import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import { useEffect, useState } from "react";
import { AnswerState } from "@components/forms/AnswerForm";
import { Option } from "@interfaces/forms";

/**
 * component to answer questions of the Checkboxes type
 *
 * separated into its own component, since multiple possible answers requires its own logic
 *
 * props:
 * - the answer state, passed down from answerForm
 * - setAnswer function to change answer state
 */
const AnswerCheckboxes: React.FC<{
  answer: AnswerState;
  setAnswer: (answer: AnswerState) => void;
}> = ({ answer, setAnswer }) => {
  // state to manage which options are selected
  const [selectedOptions, selectOptions] = useState<Option[]>([]);

  // every time options changes, set answer to the concatenation of selected options
  useEffect(() => {
    setAnswer({
      ...answer,
      answer: selectedOptions.map((option) => option.answer).join("|||"),
    });
  }, [selectedOptions]);
  /*
    Why concatenate?
    Checkboxes is the only question type that allows multiple answers.
    Rather than change the backend model to allow multiple answers to a question, we concatenate the answers to preserve the single-answer model.
    This should not cause problems when choosing a rarely-typed concatenation separator, and not allowing that separator as part of an Option.
  */

  return (
    <FormGroup>
      {(answer.question.options ?? []).map((option) => (
        <FormControlLabel
          key={option.id}
          label={option.answer}
          control={
            <Checkbox
              checked={selectedOptions.includes(option)}
              color="primary"
              onChange={(e) => {
                if (e.target.checked) {
                  if (!selectedOptions.includes(option)) {
                    selectOptions([...selectedOptions, option]);
                  }
                } else {
                  if (selectedOptions.includes(option)) {
                    selectOptions(selectedOptions.filter((selectedOption) => selectedOption !== option));
                  }
                }
              }}
            />
          }
        />
      ))}
    </FormGroup>
  );
};

export default AnswerCheckboxes;
