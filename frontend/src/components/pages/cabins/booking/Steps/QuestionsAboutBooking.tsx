import { Stack, TextField, Typography } from "@mui/material";

import { CabinFragment } from "@/generated/graphql";
import dayjs from "@/lib/date";

import { Stepper } from "./Stepper";

type Props = {
  setExtraInfo: React.Dispatch<React.SetStateAction<string>>;
  chosenCabins: CabinFragment[];
  startDate: dayjs.Dayjs | undefined;
  endDate: dayjs.Dayjs | undefined;
};

export const ExtraInfoSite: React.FC<Props> = ({ setExtraInfo, startDate, endDate, chosenCabins }) => {
  return (
    <>
      <Stack direction="column" justifyContent="center" alignItems="center">
        <Stack direction="column" maxWidth={(theme) => theme.breakpoints.values["md"]}>
          <Typography variant="h3" gutterBottom textAlign="center">
            Ekstra informasjon
          </Typography>
          <div>
            <Typography variant="body1">
              På neste side sender du søknad om å booke {chosenCabins.map((cabin) => cabin.name).join(" og ")} fra{" "}
              {startDate?.format("LL")} til {endDate?.format("LL")}.
            </Typography>
            <Typography variant="body1">
              Hytteforeningen får en e-post med søknaden din, og hvis de godkjenner bookingen sender de en faktura.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Har du noen spørsmål? Da kan du skrive de inn nedenfor, så sendes de sammen med søknaden din.
            </Typography>
          </div>
          <TextField
            placeholder="Fyll inn spørsmål..."
            multiline
            rows={6}
            fullWidth
            onChange={(e) => setExtraInfo(e.target.value)}
            helperText=" "
          />
        </Stack>
      </Stack>
      <Stepper />
    </>
  );
};
