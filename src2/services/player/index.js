import { useContext, useMemo } from 'react';

import { useRefreshMutation } from '#/services/graphql/refreshHooks';

import { AuthContext } from '#/utils/context';

import { createHeaders } from '#/helpers';

import bookmarkPosition from './bookmarkPosition.graphql';
import removeBookmarkPosition from './removeBookmarkPosition.graphql';

export const localBookmarksCache = {};
export const useBookmarkPosition = editorialId => {
  const {
    state: {
      nagra: { token: nagraToken },
      ufinity: { token: ufinityToken }
    } = {}
  } = useContext(AuthContext);

  const [createBookmark] = useRefreshMutation({
    gql: bookmarkPosition,
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    },
    variables: {
      editorialId
    }
  });

  return useMemo(
    () => time => {
      // leaving this debug code commented as it is too useful and I used it more than once already
      // console.log('creating bookmark', editorialId, time, Math.floor(time / 60) + ':' + time % 60);
      localBookmarksCache[editorialId] = time;
      createBookmark({ variables: { position: time } });
    },
    [editorialId]
  );
};

export const useRemoveBookmarkPosition = editorialId => {
  const {
    state: {
      nagra: { token: nagraToken },
      ufinity: { token: ufinityToken }
    } = {}
  } = useContext(AuthContext);

  return useRefreshMutation({
    gql: removeBookmarkPosition,
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    },
    variables: {
      editorialId
    }
  });
};
