/** @format */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { isIntegerString } from '@/common/numbers';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Main, PageGrid } from '@/components/page-structure';
import { GridCard } from '@/components/page-structure/cards';
import { TBody, TD, TH, TR, Table } from '@/components/table';
import { LocationType } from '@/models/location';
import { routes } from '@/router/routes';
import {
  useCreateLocation,
  useDeleteLocation,
  useGetLocation,
  useLocation,
  useUpdateLocation,
} from '@/store/slices/locations/hooks';
import { createLocationThunk, deleteLocationThunk } from '@/store/slices/locations/thunks';

import { LocationPagePropsType } from './types';

const Location: React.FunctionComponent<LocationPagePropsType> = ({}) => {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const id = useMemo(() => (_id && isIntegerString(_id) ? parseInt(_id) : undefined), [_id]);
  const isCreate = useMemo(() => _id === 'create', [_id]);
  const { getLocation } = useGetLocation();
  const { updateLocation } = useUpdateLocation();
  const { createLocation } = useCreateLocation();
  const { deleteLocation } = useDeleteLocation();
  const location = useLocation(id);

  const [localLocation, setLocalLocation] = useState<
    Partial<Omit<LocationType, 'tags'> & { tags?: string }>
  >({ ...(location || {}), tags: location?.tags?.join(', ') });

  useEffect(() => {
    if (!id && !isCreate) navigate(routes.locations.path);
  }, [navigate, id, isCreate]);

  useEffect(() => {
    if (id) getLocation({ id });
  }, [getLocation, id]);

  useEffect(() => {
    if (location) setLocalLocation({ ...(location || {}), tags: location?.tags?.join(', ') });
  }, [location]);

  const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalLocation({ ...(localLocation || {}), name: event.currentTarget.value });
    },
    [localLocation]
  );

  const onTagsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalLocation({
        ...(localLocation || {}),
        tags: event.currentTarget.value,
      });
    },
    [localLocation]
  );

  const save = useCallback(() => {
    const { id, name, tags } = localLocation;
    if (name) {
      if (isCreate)
        createLocation({
          name,
          tags:
            tags
              ?.split(',')
              .map((tag) => tag.trim())
              .filter((tag) => !!tag) || [],
        }).then((action) => {
          if (createLocationThunk.fulfilled.match(action)) {
            navigate(generatePath(routes.location.path, action.payload.data.id));
          }
        });
      else if (id)
        updateLocation({
          id,
          name,
          tags:
            tags
              ?.split(',')
              .map((tag) => tag.trim())
              .filter((tag) => !!tag) || [],
        });
    }
  }, [localLocation, updateLocation, createLocation, isCreate, navigate]);

  const del = useCallback(() => {
    const { id } = localLocation;
    if (id) {
      deleteLocation({ id }).then((action) => {
        if (deleteLocationThunk.fulfilled.match(action)) {
          navigate(routes.locations.path);
        }
      });
    }
  }, [deleteLocation, localLocation, navigate]);

  return (
    <Main>
      <PageGrid>
        <GridCard colSpan={2} rowSpan={5}>
          <Table>
            <TBody>
              <TR>
                <TH left>ID</TH>
                <TD right>{location?.id || '-'}</TD>
              </TR>
              <TR>
                <TH left>Name</TH>
                <TD right>
                  <Input value={localLocation?.name} onChange={onNameChange} />
                </TD>
              </TR>
              <TR>
                <TH left>Tags</TH>
                <TD right>
                  <Input value={localLocation?.tags} onChange={onTagsChange} />
                </TD>
              </TR>
            </TBody>
          </Table>
          <Button onClick={save} disabled={!(localLocation?.id || isCreate) || !localLocation.name}>
            Save
          </Button>
          <Button onClick={del} disabled={!localLocation?.id}>
            Delete
          </Button>
        </GridCard>
      </PageGrid>
    </Main>
  );
};

export default Location;
