import BankArtifact from "@contracts/Bank.json"

interface ContractInterface {
  abi: Array<any>;
  networks: any;
}

export const BankContract: ContractInterface = BankArtifact