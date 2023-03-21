import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent
} from "../generated/NftMarketplace/NftMarketplace"
import { ItemBought, ItemCanceled, ItemListed,  ActiveItem} from "../generated/schema"

export function handleItemBoutght (event: ItemBoughtEvent): void {

//cargo el item  comprado con el ID indicado
  let itemBought = ItemBought.load(getIdFromEventParams(event.params.tokenId, event.params.nftaddress ))

  //Si no existe, tengo que crear uno nuevo

  if(!itemBought){
    itemBought = new ItemBought(getIdFromEventParams(event.params.tokenId, event.params.nftaddress ))

  }

  //y luego le paso los parametros comprador, nftaddress y tokenid y luego hago .save para guardar

  itemBought.buyer = event.params.buyer
  itemBought.nftAddress = event.params.nftaddress
  itemBought.tokenId = event.params.tokenId
  
  itemBought.save()


  //El activeItem lo cargo y solo tengo que pasarle el nuevo comprador porque ya este objeto estara por listado osea que tendra todo los datos de nftaddress y tokenid
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftaddress ))
  activeItem!.buyer = event.params.buyer
  activeItem!.save()




}

export function handleItemCanceled (event: ItemCanceledEvent): void {

  let itemCanceled = ItemCanceled.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress ))

  if(!itemCanceled){
    itemCanceled = new ItemCanceled(getIdFromEventParams(event.params.tokenId, event.params.nftAddress ))

  }
  itemCanceled.seller = event.params.seller
  itemCanceled.nftAddress = event.params.nftAddress
  itemCanceled.tokenId = event.params.tokenId

  itemCanceled.save()

  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress ))
  activeItem!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD")
  activeItem!.save()


}

export function handleItemListed (event: ItemListedEvent): void {
  let itemListed = ItemListed.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress ))

  if(!itemListed){
    itemListed = new ItemListed(getIdFromEventParams(event.params.tokenId, event.params.nftAddress ))

  }
  itemListed.seller = event.params.seller
  itemListed.nftAddress = event.params.nftAddress
  itemListed.tokenId = event.params.tokenId
  itemListed.price = event.params.price


  itemListed.save()

  

  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress ))

  if(!activeItem){
    activeItem = new ActiveItem(getIdFromEventParams(event.params.tokenId, event.params.nftAddress ))

  }
  activeItem.seller = event.params.seller
  activeItem.nftAddress = event.params.nftAddress
  activeItem.tokenId = event.params.tokenId
  activeItem.price = event.params.price
  activeItem.buyer = Address.fromString("0x0000000000000000000000000000000000000000")

  activeItem.save()

}


function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string{
  return tokenId.toHexString() + nftAddress.toHexString()
}