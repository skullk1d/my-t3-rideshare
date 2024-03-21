import { type User } from '@prisma/client';
import { type Dispatch, type ReactNode, type SetStateAction, createContext, useState } from 'react';
import { api } from '~/utils/api';

type Props = {
  children?: ReactNode;
};

const defaultUser: User = {
  id: 1,
  name: '',
  email: '',
};

export const ActiveUserContext = createContext<{
  activeUser: User;
  setActiveUser: Dispatch<SetStateAction<User>>;
}>({
  activeUser: defaultUser,
  setActiveUser: () => void 0,
});

const ActiveUserWrapper = ({ children }: Props) => {
  // ASSUMPTION: At least one user exists
  const fetchUsers = api.users.get.useQuery([1]);

  const [activeUser, setActiveUser] = useState((fetchUsers.data as User) ?? defaultUser);

  return (
    <ActiveUserContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </ActiveUserContext.Provider>
  );
};

export default ActiveUserWrapper;
