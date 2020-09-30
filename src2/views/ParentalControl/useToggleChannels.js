import _omit from 'lodash/omit';

import { noop } from '#/helpers';
import { useLoadingComplete } from '#/utils/hooks';

import { useRestrictChannels, useAllowChannels } from '#/services/settings';

const mapById = list => list?.map(({ id } = {}) => id);

const getChannelIdArgs = (channelIds = []) => ({
  variables: {
    channelIds
  }
});

const useToggleChannels = ({
  onComplete = noop,
  selectedChannels = {},
  restrictedChannels = []
}) => {
  const [restrict, { loading: restrictLoading, error }] = useRestrictChannels();
  const [
    allow,
    { loading: allowLoading, error: allowError }
  ] = useAllowChannels();

  const loading = restrictLoading || allowLoading;

  useLoadingComplete({
    loading,
    onComplete
  });

  const channelsToUnrestrict = mapById(
    restrictedChannels?.filter(({ id } = {}) => !selectedChannels[id])
  );

  const channelsToRestrict = Object.keys(
    _omit(selectedChannels, mapById(restrictedChannels))
  );

  const toggleChannels = () => {
    if (channelsToRestrict?.length) {
      restrict(getChannelIdArgs(channelsToRestrict));
    }

    if (channelsToUnrestrict?.length) {
      allow(getChannelIdArgs(channelsToUnrestrict));
    }
  };

  return [toggleChannels, { loading, error: error || allowError }];
};

export default useToggleChannels;
