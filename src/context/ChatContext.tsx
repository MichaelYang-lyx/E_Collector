import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface ChatContextProps {
  children: ReactNode;
}

interface ChatState {
  chatId: string;
  user: any;
}

interface ChatAction {
  type: string;
  payload: any;
}

interface ChatContextValue {
  data: ChatState;
  dispatch: React.Dispatch<ChatAction>;
}

export const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatContextProvider: React.FC<ChatContextProps> = ({ children }) => {
  const {currentUser}:any  = useContext(AuthContext);
  const INITIAL_STATE: ChatState = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state: ChatState, action: ChatAction) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};