import axios from "axios";

// sends request to central auth for member validity
export const validateMember = async function (studentId) {
  try {
    const res = await axios({
      method: "post",
      url: "https://auth.app.dlsu-lscs.org/member-id",
      headers: {
        Authorization: "Bearer GziWPOSCKFaaWnlbfMeECeooN0GN_na",
        "Content-Type": "application/json",
      },
      data: {
        id: studentId,
      },
    });

    return res.data;
  } catch (err) {
    throw new Error(err.res ? err.res.data : err.message);
  }
};
