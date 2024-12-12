/** @format */
import { useEffect } from 'react';
import { Link, generatePath } from 'react-router-dom';

import { Main, PageGrid } from '@/components/page-structure';
import { CreateGridCard, GridCard } from '@/components/page-structure/cards';
import { TBody, TD, TH, THead, TR, Table } from '@/components/table';
import { routes } from '@/router/routes';
import { useGetLocations, useLocations } from '@/store/slices/locations/hooks';

import { LocationsPagePropsType } from './types';

const Locations: React.FunctionComponent<LocationsPagePropsType> = ({}) => {
  const { getLocations } = useGetLocations();
  const locations = useLocations();

  useEffect(() => {
    getLocations();
  }, [getLocations]);

  return (
    <Main>
      <PageGrid>
        <GridCard colSpan={5} rowSpan={5}>
          <Table>
            <THead>
              <TR>
                <TH center>ID</TH>
                <TH left>Name</TH>
                <TH left>Tags</TH>
              </TR>
            </THead>
            <TBody>
              {Object.values(locations).map((location) => (
                <TR key={location.id}>
                  <TD center>
                    <Link to={generatePath(routes.location.path, location)}>{location.id}</Link>
                  </TD>
                  <TD left>{location.name}</TD>
                  <TD left>{location.tags}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </GridCard>
        <CreateGridCard to={generatePath(routes.location.path, { id: 'create' })} />
      </PageGrid>
    </Main>
  );
};

export default Locations;
