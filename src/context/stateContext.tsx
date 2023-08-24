import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch
} from 'react'

export type State = {
  list: [] | undefined
  isLoading: boolean
}
const StateContext = createContext<State | undefined>(undefined)
export type DispatchAction = Dispatch<Action>
const DispatchContext = createContext<DispatchAction | undefined>(undefined)

export type Action = { type: 'PATIENT_LIST'; list: []; isLoading: boolean }
const initialState: State = { list: [], isLoading: false }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'PATIENT_LIST':
      return { ...state, list: action.list, isLoading: action.isLoading }
    default:
      return state
  }
}

type StateProviderProps = {
  children: ReactNode
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export const useStateValue = () => useContext(StateContext)
export const useDispatch = () => useContext(DispatchContext)
