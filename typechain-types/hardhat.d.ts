/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "DataPrivacyFramework",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DataPrivacyFramework__factory>;
    getContractFactory(
      name: "DataPrivacyFrameworkMpc",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DataPrivacyFrameworkMpc__factory>;
    getContractFactory(
      name: "IPrivateERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPrivateERC20__factory>;
    getContractFactory(
      name: "PrivateERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PrivateERC20__factory>;
    getContractFactory(
      name: "PrivateERC721URIStorage",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PrivateERC721URIStorage__factory>;
    getContractFactory(
      name: "PrivateERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PrivateERC721__factory>;
    getContractFactory(
      name: "ExtendedOperations",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ExtendedOperations__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "Ownable2Step",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable2Step__factory>;
    getContractFactory(
      name: "IERC1155Errors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155Errors__factory>;
    getContractFactory(
      name: "IERC20Errors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Errors__factory>;
    getContractFactory(
      name: "IERC721Errors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Errors__factory>;
    getContractFactory(
      name: "IERC4906",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC4906__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "DataOnChain",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DataOnChain__factory>;
    getContractFactory(
      name: "OnChainDatabase",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OnChainDatabase__factory>;
    getContractFactory(
      name: "PrivateAuction",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PrivateAuction__factory>;
    getContractFactory(
      name: "PrivateIdentityRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PrivateIdentityRegistry__factory>;
    getContractFactory(
      name: "PrivateNFT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PrivateNFT__factory>;
    getContractFactory(
      name: "PrivateToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PrivateToken__factory>;

    getContractAt(
      name: "DataPrivacyFramework",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.DataPrivacyFramework>;
    getContractAt(
      name: "DataPrivacyFrameworkMpc",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.DataPrivacyFrameworkMpc>;
    getContractAt(
      name: "IPrivateERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IPrivateERC20>;
    getContractAt(
      name: "PrivateERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.PrivateERC20>;
    getContractAt(
      name: "PrivateERC721URIStorage",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.PrivateERC721URIStorage>;
    getContractAt(
      name: "PrivateERC721",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.PrivateERC721>;
    getContractAt(
      name: "ExtendedOperations",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ExtendedOperations>;
    getContractAt(
      name: "Ownable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "Ownable2Step",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable2Step>;
    getContractAt(
      name: "IERC1155Errors",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155Errors>;
    getContractAt(
      name: "IERC20Errors",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Errors>;
    getContractAt(
      name: "IERC721Errors",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Errors>;
    getContractAt(
      name: "IERC4906",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC4906>;
    getContractAt(
      name: "IERC721",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721>;
    getContractAt(
      name: "IERC721Receiver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Receiver>;
    getContractAt(
      name: "ERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "DataOnChain",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.DataOnChain>;
    getContractAt(
      name: "OnChainDatabase",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.OnChainDatabase>;
    getContractAt(
      name: "PrivateAuction",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.PrivateAuction>;
    getContractAt(
      name: "PrivateIdentityRegistry",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.PrivateIdentityRegistry>;
    getContractAt(
      name: "PrivateNFT",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.PrivateNFT>;
    getContractAt(
      name: "PrivateToken",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.PrivateToken>;

    deployContract(
      name: "DataPrivacyFramework",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DataPrivacyFramework>;
    deployContract(
      name: "DataPrivacyFrameworkMpc",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DataPrivacyFrameworkMpc>;
    deployContract(
      name: "IPrivateERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IPrivateERC20>;
    deployContract(
      name: "PrivateERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PrivateERC20>;
    deployContract(
      name: "PrivateERC721URIStorage",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PrivateERC721URIStorage>;
    deployContract(
      name: "PrivateERC721",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PrivateERC721>;
    deployContract(
      name: "ExtendedOperations",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ExtendedOperations>;
    deployContract(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "Ownable2Step",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable2Step>;
    deployContract(
      name: "IERC1155Errors",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1155Errors>;
    deployContract(
      name: "IERC20Errors",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Errors>;
    deployContract(
      name: "IERC721Errors",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Errors>;
    deployContract(
      name: "IERC4906",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC4906>;
    deployContract(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721>;
    deployContract(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Receiver>;
    deployContract(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165>;
    deployContract(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "DataOnChain",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DataOnChain>;
    deployContract(
      name: "OnChainDatabase",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OnChainDatabase>;
    deployContract(
      name: "PrivateAuction",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PrivateAuction>;
    deployContract(
      name: "PrivateIdentityRegistry",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PrivateIdentityRegistry>;
    deployContract(
      name: "PrivateNFT",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PrivateNFT>;
    deployContract(
      name: "PrivateToken",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PrivateToken>;

    deployContract(
      name: "DataPrivacyFramework",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DataPrivacyFramework>;
    deployContract(
      name: "DataPrivacyFrameworkMpc",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DataPrivacyFrameworkMpc>;
    deployContract(
      name: "IPrivateERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IPrivateERC20>;
    deployContract(
      name: "PrivateERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PrivateERC20>;
    deployContract(
      name: "PrivateERC721URIStorage",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PrivateERC721URIStorage>;
    deployContract(
      name: "PrivateERC721",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PrivateERC721>;
    deployContract(
      name: "ExtendedOperations",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ExtendedOperations>;
    deployContract(
      name: "Ownable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "Ownable2Step",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable2Step>;
    deployContract(
      name: "IERC1155Errors",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1155Errors>;
    deployContract(
      name: "IERC20Errors",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Errors>;
    deployContract(
      name: "IERC721Errors",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Errors>;
    deployContract(
      name: "IERC4906",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC4906>;
    deployContract(
      name: "IERC721",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721>;
    deployContract(
      name: "IERC721Receiver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Receiver>;
    deployContract(
      name: "ERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165>;
    deployContract(
      name: "IERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "DataOnChain",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DataOnChain>;
    deployContract(
      name: "OnChainDatabase",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OnChainDatabase>;
    deployContract(
      name: "PrivateAuction",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PrivateAuction>;
    deployContract(
      name: "PrivateIdentityRegistry",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PrivateIdentityRegistry>;
    deployContract(
      name: "PrivateNFT",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PrivateNFT>;
    deployContract(
      name: "PrivateToken",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PrivateToken>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}