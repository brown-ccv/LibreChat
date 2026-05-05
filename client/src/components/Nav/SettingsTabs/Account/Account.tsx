import React from 'react';
import DisplayUsernameMessages from './DisplayUsernameMessages';
import DeleteAccount from './DeleteAccount';
import Avatar from './Avatar';
import EnableTwoFactorItem from './TwoFactorAuthentication';
import BackupCodesItem from './BackupCodesItem';
import { useAuthContext } from '~/hooks';
import { useGetStartupConfig } from '~/data-provider';

function Account() {
  const { user } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const deleteAccountEnabled = startupConfig?.interface?.deleteAccount !== false;

  return (
    <div className="flex flex-col gap-3 p-1 text-sm text-text-primary">
      <div className="pb-3">
        <DisplayUsernameMessages />
      </div>
      <div className="pb-3">
        <Avatar />
      </div>
      {user?.provider === 'local' && (
        <>
          <div className="pb-3">
            <EnableTwoFactorItem />
          </div>
          {user?.twoFactorEnabled && (
            <div className="pb-3">
              <BackupCodesItem />
            </div>
          )}
        </>
      )}
      <div className="pb-3">
        <DeleteAccount disabled={!deleteAccountEnabled} />
      </div>
    </div>
  );
}

export default React.memo(Account);
