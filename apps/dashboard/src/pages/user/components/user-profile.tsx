import { GetUserResponse } from '@music-kg/data';

import FlexTextRow from '../../../components/flex-text-row';

type UserProfileProps = {
  userProfile: GetUserResponse;
};

export const UserProfile = ({ userProfile }: UserProfileProps) => {
  return (
    <div>
      <FlexTextRow label="E-mail" value={userProfile?.email} />
      <FlexTextRow label="Name" value={userProfile?.name} />
    </div>
  );
};

export default UserProfile;
