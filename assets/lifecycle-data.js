export const lifecycleStates = Object.freeze({
  purchased: Object.freeze({
    code: "STATE 01 / PURCHASED",
    title: "A payment record exists",
    summary: "A receipt or order record can show that a product was paid for. It does not, by itself, prove that the correct identifier was activated or that value remains.",
    proves: "Retailer, date, amount and transaction context.",
    limits: "Activation success, current balance or code privacy.",
    owner: "The retailer or original seller for the purchase record.",
    evidence: "Original receipt, order page or delivery email."
  }),
  activated: Object.freeze({
    code: "STATE 02 / ACTIVATED",
    title: "An enablement checkpoint succeeded",
    summary: "Activation indicates that the relevant system accepted an instruction to enable the card or code. The exact mechanism varies by product and sales channel.",
    proves: "The identifier reached an activation checkpoint.",
    limits: "Current balance, region compatibility, privacy or future acceptance.",
    owner: "The retailer, processor or issuer named by the product.",
    evidence: "Transaction-linked activation record and the original card."
  }),
  redeemed: Object.freeze({
    code: "STATE 03 / REDEEMED",
    title: "Value was claimed or used",
    summary: "Redemption occurs after activation. For account-based products, value may move into an issuer account; for other products it may be used directly with a merchant.",
    proves: "A later value-use event was recorded.",
    limits: "Who used the credential or what balance remains elsewhere.",
    owner: "The issuer and the destination account or merchant record.",
    evidence: "Official account history, balance history or issuer support result."
  }),
  balance: Object.freeze({
    code: "STATE 04 / BALANCE SHOWN",
    title: "A value was reported at one moment",
    summary: "An official balance result is a time-specific status. It is more current than an activation receipt, but it still cannot promise that a later transaction will be approved.",
    proves: "The issuer reported a balance at the check time.",
    limits: "Future approvals, merchant acceptance or absence of later activity.",
    owner: "The issuer's official balance channel.",
    evidence: "A private, time-stamped issuer result with credentials hidden."
  }),
  approved: Object.freeze({
    code: "STATE 05 / TRANSACTION APPROVED",
    title: "One transaction completed",
    summary: "Approval is the final checkpoint in this simplified model. It describes one purchase under one set of merchant, balance and authorization conditions.",
    proves: "That specific transaction was accepted.",
    limits: "The remaining balance or success of a different transaction.",
    owner: "The merchant and issuer systems involved in the payment.",
    evidence: "Completed transaction record and updated issuer balance."
  })
});
