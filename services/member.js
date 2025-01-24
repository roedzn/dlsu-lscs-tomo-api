import { validateMember } from "./auth.js";
import pool from "../config/connectdb.js";

export const checkStatus = async function (req, res) {
  const { studentId } = req.query;

  try {
    const result = await validateMember(parseInt(studentId));

    const {
      id,
      email,
      full_name,
      committee_name,
      position_name,
      division_name,
    } = result;

    pool.query(
      `SELECT *, 6 - TIMESTAMPDIFF(HOUR, scanned_at, NOW()) as time_remaining 
        FROM scans
        WHERE student_id = ?
        ORDER BY scanned_at DESC`,
      [studentId],
      async function (err, queryResult) {
        if (err) {
          console.error("Select query error: ", err.message);
          return res
            .status(500)
            .send({ "Error getting data from DB: ": err.message });
        }

        let scanned_at = "Never scanned.";
        let time_remaining = "None";
        let status = "The member is eligible.";

        if (queryResult.length > 0) {
          const latest_scan = queryResult[0];
          scanned_at = new Date(latest_scan.scanned_at);

          scanned_at = scanned_at.toLocaleString("en-US", {
            timeZone: "Asia/Taipei",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          time_remaining = latest_scan.time_remaining;

          if (time_remaining > 0) {
            status = "The member is ineligible.";
          } else {
            time_remaining = 0;
            status = "The member is eligible.";
          }
        }

        return res.status(200).send({
          member_details: {
            id,
            email,
            full_name,
            committee_name,
            position_name,
            division_name,
          },
          previous_scan: scanned_at,
          time_remaining: time_remaining,
          status: status,
        });
      },
    );
  } catch (err) {
    console.error("Error during member validation:", err.message);
    res.status(500).send({ message: "Error validating member." });
  }
};

export const getMemberId = async function (req, res) {
  const { studentId } = req.body;

  try {
    const result = await validateMember(parseInt(studentId));

    const {
      id,
      email,
      full_name,
      committee_name,
      position_name,
      division_name,
    } = result;

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

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
            .send({ "Error inserting data into DB: ": err.message });
        }

        if (result1.length > 0) {
          return res.status(400).send({
            message:
              "The member has used up their discount within the last 6 hours.",
          });
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
                .send({ "Error inserting data into DB: ": err.message });
            }

            return res.status(200).send({
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
    res.status(500).send({ message: "Error validating member.}" });
  }
};
