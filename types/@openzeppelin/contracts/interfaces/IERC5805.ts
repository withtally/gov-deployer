/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export interface IERC5805Interface extends Interface {
  getFunction(
    nameOrSignature:
      | "CLOCK_MODE"
      | "clock"
      | "delegate"
      | "delegateBySig"
      | "delegates"
      | "getPastTotalSupply"
      | "getPastVotes"
      | "getVotes"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "DelegateChanged" | "DelegateVotesChanged"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "CLOCK_MODE",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "clock", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "delegate",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "delegateBySig",
    values: [
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BytesLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "delegates",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getPastTotalSupply",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPastVotes",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getVotes",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "CLOCK_MODE", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "clock", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "delegate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "delegateBySig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "delegates", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPastTotalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPastVotes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getVotes", data: BytesLike): Result;
}

export namespace DelegateChangedEvent {
  export type InputTuple = [
    delegator: AddressLike,
    fromDelegate: AddressLike,
    toDelegate: AddressLike
  ];
  export type OutputTuple = [
    delegator: string,
    fromDelegate: string,
    toDelegate: string
  ];
  export interface OutputObject {
    delegator: string;
    fromDelegate: string;
    toDelegate: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DelegateVotesChangedEvent {
  export type InputTuple = [
    delegate: AddressLike,
    previousVotes: BigNumberish,
    newVotes: BigNumberish
  ];
  export type OutputTuple = [
    delegate: string,
    previousVotes: bigint,
    newVotes: bigint
  ];
  export interface OutputObject {
    delegate: string;
    previousVotes: bigint;
    newVotes: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IERC5805 extends BaseContract {
  connect(runner?: ContractRunner | null): IERC5805;
  waitForDeployment(): Promise<this>;

  interface: IERC5805Interface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  CLOCK_MODE: TypedContractMethod<[], [string], "view">;

  clock: TypedContractMethod<[], [bigint], "view">;

  delegate: TypedContractMethod<[delegatee: AddressLike], [void], "nonpayable">;

  delegateBySig: TypedContractMethod<
    [
      delegatee: AddressLike,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  delegates: TypedContractMethod<[account: AddressLike], [string], "view">;

  getPastTotalSupply: TypedContractMethod<
    [timepoint: BigNumberish],
    [bigint],
    "view"
  >;

  getPastVotes: TypedContractMethod<
    [account: AddressLike, timepoint: BigNumberish],
    [bigint],
    "view"
  >;

  getVotes: TypedContractMethod<[account: AddressLike], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "CLOCK_MODE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "clock"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "delegate"
  ): TypedContractMethod<[delegatee: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "delegateBySig"
  ): TypedContractMethod<
    [
      delegatee: AddressLike,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "delegates"
  ): TypedContractMethod<[account: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "getPastTotalSupply"
  ): TypedContractMethod<[timepoint: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getPastVotes"
  ): TypedContractMethod<
    [account: AddressLike, timepoint: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getVotes"
  ): TypedContractMethod<[account: AddressLike], [bigint], "view">;

  getEvent(
    key: "DelegateChanged"
  ): TypedContractEvent<
    DelegateChangedEvent.InputTuple,
    DelegateChangedEvent.OutputTuple,
    DelegateChangedEvent.OutputObject
  >;
  getEvent(
    key: "DelegateVotesChanged"
  ): TypedContractEvent<
    DelegateVotesChangedEvent.InputTuple,
    DelegateVotesChangedEvent.OutputTuple,
    DelegateVotesChangedEvent.OutputObject
  >;

  filters: {
    "DelegateChanged(address,address,address)": TypedContractEvent<
      DelegateChangedEvent.InputTuple,
      DelegateChangedEvent.OutputTuple,
      DelegateChangedEvent.OutputObject
    >;
    DelegateChanged: TypedContractEvent<
      DelegateChangedEvent.InputTuple,
      DelegateChangedEvent.OutputTuple,
      DelegateChangedEvent.OutputObject
    >;

    "DelegateVotesChanged(address,uint256,uint256)": TypedContractEvent<
      DelegateVotesChangedEvent.InputTuple,
      DelegateVotesChangedEvent.OutputTuple,
      DelegateVotesChangedEvent.OutputObject
    >;
    DelegateVotesChanged: TypedContractEvent<
      DelegateVotesChangedEvent.InputTuple,
      DelegateVotesChangedEvent.OutputTuple,
      DelegateVotesChangedEvent.OutputObject
    >;
  };
}
