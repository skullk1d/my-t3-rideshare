import { Users } from '@prisma/client';
import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';
import { api } from '~/utils/api';

type Props = {
  children?: ReactNode;
};

const defaultUser: Users = {
  id: 1,
  name: '',
  email: '',
};

export const ActiveUserContext = createContext<{
  activeUser: Users;
  setActiveUser: Dispatch<SetStateAction<Users>>;
}>({
  activeUser: defaultUser,
  setActiveUser: () => void 0,
});

const ActiveUserWrapper = ({ children }: Props) => {
  // ASSUMPTION: At least one user exists
  const fetchUsers = api.users.get.useQuery([1]);

  const [activeUser, setActiveUser] = useState((fetchUsers.data as Users) ?? defaultUser);

  return (
    <ActiveUserContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </ActiveUserContext.Provider>
  );
};

export default ActiveUserWrapper;
