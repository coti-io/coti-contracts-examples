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
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface Miscellaneous1TestsContractInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "booleanTest"
      | "checkBound"
      | "getBooleanResults"
      | "getRandom"
      | "randTest_"
      | "randomBoundedTest"
      | "randomTest"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "booleanTest",
    values: [boolean, boolean, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "checkBound",
    values: [BigNumberish[], BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getBooleanResults",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getRandom", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "randTest_",
    values: [boolean, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "randomBoundedTest",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "randomTest",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "booleanTest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "checkBound", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getBooleanResults",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getRandom", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "randTest_", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "randomBoundedTest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "randomTest", data: BytesLike): Result;
}

export interface Miscellaneous1TestsContract extends BaseContract {
  connect(runner?: ContractRunner | null): Miscellaneous1TestsContract;
  waitForDeployment(): Promise<this>;

  interface: Miscellaneous1TestsContractInterface;

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

  booleanTest: TypedContractMethod<
    [a: boolean, b: boolean, bit: boolean],
    [void],
    "nonpayable"
  >;

  checkBound: TypedContractMethod<
    [randoms: BigNumberish[], size: BigNumberish, numBits: BigNumberish],
    [void],
    "nonpayable"
  >;

  getBooleanResults: TypedContractMethod<
    [],
    [[boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean]],
    "view"
  >;

  getRandom: TypedContractMethod<[], [bigint], "view">;

  randTest_: TypedContractMethod<
    [isBounded: boolean, numBits: BigNumberish],
    [bigint],
    "nonpayable"
  >;

  randomBoundedTest: TypedContractMethod<
    [numBits: BigNumberish],
    [bigint],
    "nonpayable"
  >;

  randomTest: TypedContractMethod<[], [bigint], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "booleanTest"
  ): TypedContractMethod<
    [a: boolean, b: boolean, bit: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "checkBound"
  ): TypedContractMethod<
    [randoms: BigNumberish[], size: BigNumberish, numBits: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getBooleanResults"
  ): TypedContractMethod<
    [],
    [[boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getRandom"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "randTest_"
  ): TypedContractMethod<
    [isBounded: boolean, numBits: BigNumberish],
    [bigint],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "randomBoundedTest"
  ): TypedContractMethod<[numBits: BigNumberish], [bigint], "nonpayable">;
  getFunction(
    nameOrSignature: "randomTest"
  ): TypedContractMethod<[], [bigint], "nonpayable">;

  filters: {};
}