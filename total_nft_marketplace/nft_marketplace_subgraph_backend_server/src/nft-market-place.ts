import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  ItemBought as ItemBoughtEvent,
  ItemCancelled as ItemCancelledEvent,
  ItemListed as ItemListedEvent,
} from "../generated/NFTMarketPlace/NFTMarketPlace";
import {
  ActiveItem,
  ItemBought,
  ItemCancelled,
  ItemListed,
} from "../generated/schema";

export function handleItemBought(event: ItemBoughtEvent): void {
  // Save that event in graph
  // update activeItems
  // get or create itemListed object
  // each item needs a unique ID
  const id = getIdFromEventParam(event.params.tokenId, event.params.nftAddress);
  let itemBought = ItemBought.load(id);
  const activeItem = ActiveItem.load(id);

  if (!itemBought) {
    itemBought = new ItemBought(id);
  }

  // updating parameters
  itemBought.tokenId = event.params.tokenId;
  itemBought.nftAddress = event.params.nftAddress;
  itemBought.tokenId = event.params.tokenId;
  activeItem!.buyer = event.params.seller; // seller is the buyer (there is mistake in the contract)

  itemBought.save();
  activeItem!.save();
}

export function handleItemCancelled(event: ItemCancelledEvent): void {
  let id = getIdFromEventParam(event.params.tokenId, event.params.nftAddress);
  let itemCancelled = ItemCancelled.load(id);
  let activeItem = ActiveItem.load(id);

  if (!itemCancelled) {
    itemCancelled = new ItemCancelled(id);
  }
  itemCancelled.seller = event.params.seller;
  itemCancelled.nftAddress = event.params.nftAddress;
  itemCancelled.tokenId = event.params.tokenId;

  activeItem!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD" // dead address
  );

  itemCancelled.save();
  activeItem!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
  const id = getIdFromEventParam(event.params.tokenId, event.params.nftAddress);
  let itemListed = ItemListed.load(id);
  let activeItem = ActiveItem.load(id);

  if (!itemListed) {
    itemListed = new ItemListed(id);
  }
  if (!activeItem) {
    activeItem = new ActiveItem(id);
  }

  itemListed.seller = event.params.seller;
  activeItem.seller = event.params.seller;

  itemListed.nftAddress = event.params.nftAddress;
  activeItem.nftAddress = event.params.nftAddress;

  itemListed.tokenId = event.params.tokenId;
  activeItem.tokenId = event.params.tokenId;

  itemListed.price = event.params.price;
  activeItem.price = event.params.price;

  activeItem.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );

  itemListed.save();
  activeItem.save();
}

function getIdFromEventParam(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString();
}
