import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch
} from 'react'

export type State = {
  list: Array<any> | undefined
  isLoading: boolean
  scannedData?: any
}
const StateContext = createContext<State | undefined>(undefined)
export type DispatchAction = Dispatch<Action>
const DispatchContext = createContext<DispatchAction | undefined>(undefined)

export type Action =
  | {
      type: 'PATIENT_LIST'
      list: Array<any>
      isLoading: boolean
    }
  | {
      type: 'QR_CODE_SCANNED'
      data: any
    }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'PATIENT_LIST':
      return { ...state, list: action.list, isLoading: action.isLoading }
    case 'QR_CODE_SCANNED':
      return { ...state, scannedData: action.data }
    default:
      return state
  }
}

type StateProviderProps = {
  children: ReactNode
}

const initialState: State = { list: [], isLoading: false }
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
