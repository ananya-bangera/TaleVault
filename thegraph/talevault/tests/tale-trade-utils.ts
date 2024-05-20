import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  POVBought,
  POVCreated,
  Transfer,
  VoteReputation
} from "../generated/TaleTrade/TaleTrade"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createPOVBoughtEvent(
  id: BigInt,
  name: string,
  genre: string,
  identify: string,
  network: string,
  story: string,
  creator: Address,
  amt: BigInt,
  status: boolean
): POVBought {
  let povBoughtEvent = changetype<POVBought>(newMockEvent())

  povBoughtEvent.parameters = new Array()

  povBoughtEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  povBoughtEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  povBoughtEvent.parameters.push(
    new ethereum.EventParam("genre", ethereum.Value.fromString(genre))
  )
  povBoughtEvent.parameters.push(
    new ethereum.EventParam("identify", ethereum.Value.fromString(identify))
  )
  povBoughtEvent.parameters.push(
    new ethereum.EventParam("network", ethereum.Value.fromString(network))
  )
  povBoughtEvent.parameters.push(
    new ethereum.EventParam("story", ethereum.Value.fromString(story))
  )
  povBoughtEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  povBoughtEvent.parameters.push(
    new ethereum.EventParam("amt", ethereum.Value.fromUnsignedBigInt(amt))
  )
  povBoughtEvent.parameters.push(
    new ethereum.EventParam("status", ethereum.Value.fromBoolean(status))
  )

  return povBoughtEvent
}

export function createPOVCreatedEvent(
  id: BigInt,
  name: string,
  genre: string,
  identify: string,
  network: string,
  story: string,
  creator: Address,
  amt: BigInt,
  status: boolean
): POVCreated {
  let povCreatedEvent = changetype<POVCreated>(newMockEvent())

  povCreatedEvent.parameters = new Array()

  povCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  povCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  povCreatedEvent.parameters.push(
    new ethereum.EventParam("genre", ethereum.Value.fromString(genre))
  )
  povCreatedEvent.parameters.push(
    new ethereum.EventParam("identify", ethereum.Value.fromString(identify))
  )
  povCreatedEvent.parameters.push(
    new ethereum.EventParam("network", ethereum.Value.fromString(network))
  )
  povCreatedEvent.parameters.push(
    new ethereum.EventParam("story", ethereum.Value.fromString(story))
  )
  povCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  povCreatedEvent.parameters.push(
    new ethereum.EventParam("amt", ethereum.Value.fromUnsignedBigInt(amt))
  )
  povCreatedEvent.parameters.push(
    new ethereum.EventParam("status", ethereum.Value.fromBoolean(status))
  )

  return povCreatedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createVoteReputationEvent(
  amt: BigInt,
  creator: Address
): VoteReputation {
  let voteReputationEvent = changetype<VoteReputation>(newMockEvent())

  voteReputationEvent.parameters = new Array()

  voteReputationEvent.parameters.push(
    new ethereum.EventParam("amt", ethereum.Value.fromUnsignedBigInt(amt))
  )
  voteReputationEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return voteReputationEvent
}
