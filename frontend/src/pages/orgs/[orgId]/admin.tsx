import { NextPage } from "next";
import { useQuery } from "@apollo/client";
import { Organization } from "@interfaces/organizations";
import { GET_ORGANIZATION } from "@graphql/orgs/queries";
import { useRouter } from "next/router";
import Layout from "@components/Layout";
import { Container, Box } from "@material-ui/core";
import EditUsersInOrganization from "@components/pages/orgs/UserAdmin";

const AdminPage: NextPage = () => {
  const { orgId } = useRouter().query;

  const { loading, error, data } = useQuery<{ organization: Organization }>(GET_ORGANIZATION, {
    variables: { orgId: orgId as string },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <Layout>
      <Container>
        <Box>
          {data && (
            <>
              <EditUsersInOrganization organization={data.organization} />
            </>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default AdminPage;
