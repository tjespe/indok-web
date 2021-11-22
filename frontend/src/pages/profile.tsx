import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { GET_USER } from "@graphql/users/queries";
import { User } from "@interfaces/users";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { EditUserProps } from "../components/pages/profile/EditUser";
import { FirstLoginProps } from "../components/pages/profile/FirstLogin";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: { width: "fit-content" },
    content: { marginLeft: theme.spacing(2), marginRight: theme.spacing(2) },
    avatarBox: { display: "flex", flexDirection: "column", alignItems: "center", padding: theme.spacing(2) },
    userInfoBox: { marginTop: theme.spacing(2), marginBottom: theme.spacing(2) },
    padding: { padding: theme.spacing(4) },
    cardPadding: { paddingTop: theme.spacing(4) },
  })
);

const ID_PREFIX = "profile";

const ProfilePage: NextPage = () => {
  const { loading, error, data } = useQuery<{ user: User }>(GET_USER);

  const [firstLoginOpen, setFirstLoginOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const classes = useStyles();
  const router = useRouter();

  if (loading) {
    return <Typography variant="h1">Laster ...</Typography>;
  }

  if (!data || !data.user || error) {
    if (typeof window !== "undefined") {
      // redirect user to homepage if no user data and client side
      router.push("/");
      return null;
    }
  }

  if (data?.user?.firstLogin && !firstLoginOpen) {
    setFirstLoginOpen(true);
  }

  const onSubmit = async () => {
    firstLoginOpen && setFirstLoginOpen(false);
    editUserOpen && setEditUserOpen(false);
  };

  const FirstLogin = dynamic<FirstLoginProps>(() =>
    import("@components/pages/profile/FirstLogin").then((module) => module.FirstLogin)
  );

  const EditUser = dynamic<EditUserProps>(() =>
    import("@components/pages/profile/EditUser").then((module) => module.EditUser)
  );

  return (
    <Layout>
      <Container className={classes.padding}>
        <Typography variant="h1">Brukerprofil</Typography>
        {data?.user && (
          <>
            {firstLoginOpen && <FirstLogin open={firstLoginOpen} onSubmit={onSubmit} fullName={data.user.firstName} />}
            {editUserOpen && (
              <EditUser
                open={editUserOpen}
                onSubmit={onSubmit}
                user={data.user}
                onClose={() => setEditUserOpen(false)}
              />
            )}
            <Grid container className={classes.cardPadding}>
              <Grid item xs={6}>
                <Card variant="outlined" className={classes.card}>
                  <CardContent>
                    <Box className={classes.content}>
                      <Box className={classes.avatarBox}>
                        <Avatar>{data.user.firstName[0]}</Avatar>
                        <Typography
                          variant="h4"
                          data-test-id={`${ID_PREFIX}-fullName`}
                        >{`${data.user.firstName} ${data.user.lastName}`}</Typography>
                      </Box>
                      <Box className={classes.userInfoBox}>
                        <Typography variant="body1">
                          <strong>E-post:</strong> {data.user.email || data.user.feideEmail}
                        </Typography>
                        {data.user.phoneNumber && (
                          <Typography variant="body1">
                            <strong>Mobilnummer:</strong> {data.user.phoneNumber}
                          </Typography>
                        )}
                        {data.user.gradeYear && (
                          <Typography variant="body1">
                            <strong>Klassetrinn:</strong>{" "}
                            {`${data.user.gradeYear} (avgangsår ${data.user.graduationYear})`}
                          </Typography>
                        )}
                        {data.user.allergies && (
                          <Typography variant="body1">
                            <strong>Allergier/matpreferanser:</strong> {data.user.allergies}
                          </Typography>
                        )}
                      </Box>
                      {data.user.dateJoined && (
                        <Typography variant="body2">
                          Medlem siden {new Date(data.user.dateJoined).toLocaleString().split(",")[0]} <br />
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions className={classes.content}>
                    <Button onClick={() => setEditUserOpen(true)} startIcon={<EditIcon />}>
                      Rediger bruker
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography gutterBottom variant="h4">
                          Mine organisasjoner
                        </Typography>
                        <Typography>{`Her kommer en liste over alle organisasjoner du er medlem av`}</Typography>
                      </CardContent>
                      <CardActions>
                        <Link href="/orgs">
                          <Button>Gå til organisasjoner</Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography gutterBottom variant="h4">
                          Mine arrangementer
                        </Typography>
                        <Typography>{`Her kommer en liste over alle arrangementer du har meldt deg på`}</Typography>
                      </CardContent>
                      <CardActions>
                        <Link href="/events" passHref>
                          <Button>Gå til arrangementer</Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography gutterBottom variant="h4">
                          Mine vervsøknader
                        </Typography>
                        <Typography>{`Her kommer en liste over verv du har søkt på`}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button disabled>Gå til vervsøking</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography gutterBottom variant="h4">
                          Baksida
                        </Typography>
                        <Typography>{`Har du opplevd noe ugreit, ubehagelig eller ulovlig på Indøk? Da kan du varsle om det.`}</Typography>
                      </CardContent>
                      <CardActions>
                        <Link href="/report" passHref>
                          <Button>Gå til Baksida</Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography gutterBottom variant="h4">
                          Mine ordre
                        </Typography>
                        <Typography>{`Se en oversikt over alle betalinger du har gjort`}</Typography>
                      </CardContent>
                      <CardActions>
                        <Link href="/ecommerce">
                          <Button>Gå til betalinger</Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default ProfilePage;
