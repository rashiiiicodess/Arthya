import express from 'express';
import Bank from '../models/bankModel.js';
export const BankData = async (req, res) => {
  try {
    const risk = req.query.risk?.toLowerCase();
    const type = req.query.type?.toLowerCase();

    const filter = {};

    if (risk) filter["meta.risk_level"] = risk;
    if (type) filter.bank_type = type;

    const banks = await Bank.find(filter)
      .sort({ "analytics.ranking_score": -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: banks.length,
      data: banks
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bank data',
      error: error.message
    });
  }
};