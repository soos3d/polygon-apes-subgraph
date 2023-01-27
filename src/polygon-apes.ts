import {
  Transfer as TransferEvent,
  PolygonApes,
} from "../generated/PolygonApes/PolygonApes"
import {
  PolygonApe,
  Transfer,
} from "../generated/schema"

export function handleTransfer(event: TransferEvent): void {

  // Handler code for the Transfer entity
  let transfer = new Transfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
  transfer.from = event.params.from
  transfer.to = event.params.to
  transfer.tokenId = event.params.tokenId
  transfer.blockNumber = event.block.number
  transfer.transactionHash = event.transaction.hash
  transfer.save()
  //The transfer entity handler code ends here


  // Handler code for the PolygonApe entity
  let contractAddress = PolygonApes.bind(event.address);

  let polygonApe = PolygonApe.load(event.params.tokenId.toString());
  if (polygonApe == null) {
    polygonApe = new PolygonApe(event.params.tokenId.toString());
    polygonApe.symbol = contractAddress.symbol();
    polygonApe.name = contractAddress.name();
    polygonApe.creator = event.params.to;
    polygonApe.tokenURI = contractAddress.tokenURI(event.params.tokenId);
  }
  polygonApe.newOwner = event.params.to;
  polygonApe.blockNumber = event.block.number;
  polygonApe.save();
  // The PolygonApe entity handler code ends here
}