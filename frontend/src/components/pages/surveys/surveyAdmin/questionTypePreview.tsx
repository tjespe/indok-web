import { Question } from "@interfaces/surveys";
import { RadioGroup, Radio, TextField, FormControlLabel, FormGroup, Checkbox } from "@material-ui/core";

const QuestionTypePreview: React.FC<{
  question: Question;
}> = ({ question }) => {
  switch (question.questionType.name) {
    case "Short answer":
      return <TextField disabled label="Kortsvar" variant="outlined" />;
    case "Paragraph":
      return <TextField disabled label="Langsvar" variant="outlined" multiline rows={4} />;
    case "Multiple choice":
      return (
        <RadioGroup>
          {question.options.map((option, index) => (
            <FormControlLabel key={index} label={option.answer} control={<Radio disabled />} />
          ))}
        </RadioGroup>
      );
    case "Checkboxes":
      return (
        <FormGroup>
          {question.options.map((option, index) => (
            <FormControlLabel key={index} label={option.answer} control={<Checkbox disabled />} />
          ))}
        </FormGroup>
      );
    case "Drop-down":
      return (
        <ol>
          {question.options.map((option, index) => (
            <li key={index}>{option.answer}</li>
          ))}
        </ol>
      );
    default:
      // TODO: change implementation of question types to avoid failsafes like this
      return <p>Error in question</p>;
  }
};

export default QuestionTypePreview;
