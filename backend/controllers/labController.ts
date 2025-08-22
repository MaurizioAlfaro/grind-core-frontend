import asyncHandler from "express-async-handler";
import {
  investLabXp as investLabXpLogic,
  createHomunculus as createHomunculusLogic,
  purchaseLabEquipment as purchaseLabEquipmentLogic,
  startHibernation as startHibernationLogic,
  claimHibernation as claimHibernationLogic,
  feedHomunculus as feedHomunculusLogic,
  assignToWork as assignToWorkLogic,
  collectPay as collectPayLogic,
  equipHomunculusItem as equipHomunculusItemLogic,
  unequipHomunculusItem as unequipHomunculusItemLogic,
} from "../logic";

const handleLogic = asyncHandler(
  async (req: any, res: any, logicFn: Function, ...args: any[]) => {
    const playerDoc = req.player;
    const result = logicFn(playerDoc.toObject(), ...args);

    if (result.success && result.newPlayerState) {
      Object.assign(playerDoc, result.newPlayerState);
      await playerDoc.save();
      res.status(200).json({ ...result, newPlayerState: playerDoc.toObject() });
    } else {
      res.status(400).json(result);
    }
  }
) as any;

export const investLabXp = (req: any, res: any) =>
  handleLogic(req, res, investLabXpLogic, req.body.amount);
export const createHomunculus = (req: any, res: any) =>
  handleLogic(req, res, createHomunculusLogic, req.body.slottedParts);
export const purchaseLabEquipment = (req: any, res: any) =>
  handleLogic(req, res, purchaseLabEquipmentLogic, req.body.equipmentId);
export const startHibernation = (req: any, res: any) =>
  handleLogic(
    req,
    res,
    startHibernationLogic,
    req.body.homunculusId,
    req.body.isDevMode
  );
export const claimHibernation = (req: any, res: any) =>
  handleLogic(req, res, claimHibernationLogic, req.body.homunculusId);
export const feedHomunculus = (req: any, res: any) =>
  handleLogic(
    req,
    res,
    feedHomunculusLogic,
    req.body.homunculusId,
    req.body.foodItemId
  );
export const assignToWork = (req: any, res: any) =>
  handleLogic(
    req,
    res,
    assignToWorkLogic,
    req.body.homunculusId,
    req.body.zoneId
  );
export const collectPay = (req: any, res: any) =>
  handleLogic(req, res, collectPayLogic, req.body.homunculusId);
export const equipHomunculusItem = (req: any, res: any) =>
  handleLogic(
    req,
    res,
    equipHomunculusItemLogic,
    req.body.homunculusId,
    req.body.itemId
  );
export const unequipHomunculusItem = (req: any, res: any) =>
  handleLogic(
    req,
    res,
    unequipHomunculusItemLogic,
    req.body.homunculusId,
    req.body.slot
  );
