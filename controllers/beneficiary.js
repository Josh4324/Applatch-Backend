const BeneficiaryService = require("../services/beneficiary");
const { Response, Token } = require("../helpers");
const { v4: uuidv4 } = require("uuid");
const random = require("random");

const beneficiaryService = new BeneficiaryService();
const token = new Token();

exports.createBeneficiary = async (req, res) => {
  try {
    const beneficiary = await beneficiaryService.createBeneficiary(req.body);

    const response = new Response(
      true,
      201,
      "Lock created successfully",
      beneficiary
    );
    return res.status(response.code).json(response);
  } catch (err) {
    console.log(err);
    const response = new Response(
      false,
      500,
      "An error ocurred, please try again",
      err
    );
    return res.status(response.code).json(response);
  }
};

exports.getBeneficiary = async (req, res) => {
  try {
    const { status } = req.params;

    const beneficiary = await beneficiaryService.findBeneficiaryWithStatus(
      status
    );

    const code = random.int(0, beneficiary.length - 1);

    const data = {
      result: beneficiary[code],
    };

    const response = new Response(true, 200, "Success", data);

    res.status(response.code).json(response);
  } catch (err) {
    console.log(err);
    const response = new Response(
      false,
      500,
      "An error ocurred, please try again",
      err
    );
    res.status(response.code).json(response);
  }
};
