import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  POVBought as POVBoughtEvent,
  POVCreated as POVCreatedEvent,
  Transfer as TransferEvent,
  VoteReputation as VoteReputationEvent
} from "../generated/TaleTrade/TaleTrade"
import {
  Approval,
  ApprovalForAll,
  POVBought,
  POVCreated,
  Transfer,
  VoteReputation
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePOVBought(event: POVBoughtEvent): void {
  let entity = new POVBought(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.TaleTrade_id = event.params.id
  entity.name = event.params.name
  entity.genre = event.params.genre
  entity.identify = event.params.identify
  entity.network = event.params.network
  entity.story = event.params.story
  entity.creator = event.params.creator
  entity.amt = event.params.amt
  entity.status = event.params.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePOVCreated(event: POVCreatedEvent): void {
  let entity = new POVCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.TaleTrade_id = event.params.id
  entity.name = event.params.name
  entity.genre = event.params.genre
  entity.identify = event.params.identify
  entity.network = event.params.network
  entity.story = event.params.story
  entity.creator = event.params.creator
  entity.amt = event.params.amt
  entity.status = event.params.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoteReputation(event: VoteReputationEvent): void {
  let entity = new VoteReputation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amt = event.params.amt
  entity.creator = event.params.creator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
