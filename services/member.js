import { validateMember } from "./auth.js";
import pool from "../config/connectdb.js";

export const getMemberId = async function (req, res) {
  const { studentId } = req.body;

  try {
    const result = await validateMember(studentId);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    // can be removed for privacy
    const {
      id,
      email,
      full_name,
      committee_name,
      position_name,
      division_name,
    } = result;

    pool.query(
      `SELECT * FROM scans
        WHERE student_id = ?
        AND TIMESTAMPDIFF(HOUR, scanned_at, NOW()) < 6`,
      [studentId],
      async function (err, result1) {
        if (err) {
          console.error("Select query error: ", err.message);
          return res
            .status(500)
            .send("Error inserting data into DB: ", err.message);
        }

        if (result1.length > 0) {
          return res
            .status(400)
            .send(
              "The member has used up their discount within the last 6 hours.",
            );
        }

        pool.query(
          `INSERT INTO scans (student_id, scanned_at)
           VALUES(?, NOW())`,
          [studentId],
          async function (err, result) {
            if (err) {
              console.error("Insert process error:", err.message);
              return res
                .status(500)
                .send("Error inserting data into DB: ", err.message);
            }

            // can be removed for privacy
            return res.json({
              id,
              email,
              full_name,
              committee_name,
              position_name,
              division_name,
            });
          },
        );
      },
    );
  } catch (err) {
    console.error("Error during member validation:", err.message);
    res.status(500).send("Error validating member.");
  }
};
