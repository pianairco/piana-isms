SELECT *
FROM (SELECT ROW_NUMBER() OVER(ORDER BY gl_number) row_num,  'GL' report_type,
             '@X_SEARCH_FUND_ID' fund_id,
             gl_id ref_id,
             gl_number ref_number,
             gl_id account_id,
             gl_number account_number,
             gl_name account_name,
             balance_debit,
             balance_credit,
             period_debit,
             period_credit,
             DECODE (SIGN (balance_remainder + period_credit - period_debit),
                     -1, -(balance_remainder + period_credit - period_debit),
                     0
                 ) total_debit,
             DECODE (SIGN (balance_remainder + period_credit - period_debit),
                     -1, 0,
                     balance_remainder + period_credit - period_debit
                 ) total_credit,
             balance_remainder + period_credit - period_debit total_remainder
      FROM (SELECT   gl.gl_id,
                     gl.gl_number,
                     gl.gl_name,
                     SUM (CASE
                              WHEN (voucher_type_id IN (15, nvl(@x_with_opening_year_voucher, -1)))
                                  OR voucher_date BETWEEN '@x_balance_date_from' AND '@x_balance_date_to'
                                  THEN vlin.credit_amount - vlin.debit_amount
                              ELSE 0
                         END
                         ) balance_remainder,
                     SUM (CASE
                              WHEN (voucher_type_id IN (15, nvl(@x_with_opening_year_voucher, -1)))
                                  OR voucher_date BETWEEN '@x_balance_date_from' AND '@x_balance_date_to'
                                  THEN vlin.debit_amount
                              ELSE 0
                         END
                         ) balance_debit,
                     SUM (CASE
                              WHEN (voucher_type_id IN (15, nvl(@x_with_opening_year_voucher, -1)))
                                  OR voucher_date BETWEEN '@x_balance_date_from' AND '@x_balance_date_to'
                                  THEN vlin.credit_amount
                              ELSE 0
                         END
                         ) balance_credit,
                     SUM (CASE
                              WHEN (voucher_type_id NOT IN (15, nvl(@x_with_opening_year_voucher, -1)))
                                  AND voucher_date BETWEEN '@x_from_date' AND '@x_to_date'
                                  THEN vlin.debit_amount
                              ELSE 0
                         END
                         ) period_debit,
                     SUM (CASE
                              WHEN (voucher_type_id NOT IN (15, nvl(@x_with_opening_year_voucher, -1)))
                                  AND voucher_date BETWEEN '@x_from_date' AND '@x_to_date'
                                  THEN vlin.credit_amount
                              ELSE 0
                         END
                         ) period_credit,
                     SUM (vlin.credit_amount - vlin.debit_amount) total_remainder
            FROM (SELECT 'NORMAL' rec_type, vm.voucher_id,
                         vm.voucher_date,
                         vm.branch_id,
                         vm.voucher_number,
                         vm.voucher_temp_number,
                         vm.voucher_type_id,
                         vm.voucher_status_id
                  FROM vw_voucher_master vm
                  WHERE voucher_date BETWEEN '@x_balance_date_from' AND '@x_to_date'
                    AND (voucher_type_id NOT IN (15, 18, 19, 20) OR
                         (voucher_type_id = 18 AND year_id NOT IN (@X_YEAR_ID)))
                    AND FUND_ID = @X_FUND_ID
                  UNION
                  SELECT 'CONDITIONED' rec_type, vm.voucher_id,
                         CASE
                             WHEN nvl(@x_with_opening_year_voucher, -1) <> -1
                                 THEN (SELECT min(start_date)
                                       FROM fiscal_year
                                       WHERE '@x_from_date' BETWEEN start_date AND end_date
                                         AND FUND_ID = @X_FUND_ID)
                             ELSE vm.voucher_date
                             END voucher_date,
                         vm.branch_id,
                         vm.voucher_number,
                         vm.voucher_temp_number,
                         vm.voucher_type_id,
                         vm.voucher_status_id
                  FROM vw_voucher_master vm
                  WHERE voucher_type_id IN (15, 20)
                    AND year_id IN (@X_from_year_id)
                    AND FUND_ID = @X_FUND_ID
                    AND  @x_vm_date_condition
                  UNION
                  SELECT 'CONDITIONED' rec_type, vm.voucher_id,
                         vm.voucher_date,
                         vm.branch_id,
                         vm.voucher_number,
                         vm.voucher_temp_number,
                         vm.voucher_type_id,
                         vm.voucher_status_id
                  FROM vw_voucher_master vm
                  WHERE voucher_type_id = 18
                    AND year_id IN (@X_YEAR_ID)
                    AND FUND_ID = @X_FUND_ID
                  UNION
                  SELECT 'CONDITIONED' rec_type, vm.voucher_id,
                         vm.voucher_date,
                         vm.branch_id,
                         vm.voucher_number,
                         vm.voucher_temp_number,
                         vm.voucher_type_id,
                         vm.voucher_status_id
                  FROM vw_voucher_master vm
                  WHERE voucher_type_id = 19
                    AND year_id IN (@X_YEAR_ID)
                    AND FUND_ID = @X_FUND_ID) vmas,
                 voucher_line vlin,
                 general_ledger gl,
                 subsidiary_ledger sl
            WHERE vmas.voucher_status_id <> 1
              AND vmas.voucher_id = vlin.voucher_id
              AND vlin.sl_id = sl.sl_id
              AND sl.gl_id = gl.gl_id
              AND gl_number BETWEEN nvl(@x_from_gl_number, 0) AND nvl(@x_to_gl_number, 999999999999999999)
                {if:not-null:@x_branches:AND VLIN.branch_id in (@x_branches)}
              AND (('CONDITIONED' = rec_type AND voucher_type_id in (15, 20, nvl(@x_with_closing_account_voucher, -1), nvl(@x_with_closing_year_voucher, -1)))
                OR ('NORMAL' = rec_type AND @x_vmas_date_condition
                    AND voucher_number between nvl(@x_from_voucher_no, 0) AND nvl(@x_to_voucher_no, 999999999999999999)
                    AND voucher_temp_number between nvl(@x_from_voucher_temp_num, 0) and nvl(@x_to_voucher_temp_num, 999999999999999999)))
            GROUP BY gl.gl_id, gl.gl_number, gl.gl_name))
WHERE balance_debit + balance_credit + period_debit + period_credit <> 0
  AND ABS(total_remainder) BETWEEN nvl(@x_from_remainder, 0) AND nvl(@x_to_remainder, 999999999999999999)
