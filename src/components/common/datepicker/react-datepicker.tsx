import { CaptionLabel, DayPicker, getDefaultClassNames } from "react-day-picker";
import { ja } from "date-fns/locale/ja";
import { format } from "date-fns";
import dayjs from "dayjs";
import styles from "./react-datepicker.module.scss";
import { useState } from "react";
import "react-day-picker/dist/style.css";

/**
 *
 * @param {Date} date   'YYYY-MM-DD'
 * @param {function} onSelect  what to do after date select
 * @returns
 */

type DatePickerProps = {
  onSelect: (...args: any[]) => void;
  date?: string | number | Date;
  fromDate?: Date | undefined;
  toDate?: Date | undefined;
  fromYear?: number;
  toYear?: number;
};

export default function ReactDatepicker(props: DatePickerProps) {
  /**
   * {onSelect} function return date to parent
   */
  const { onSelect, date } = props;
  const classNames = {
    ...styles,
    root: styles.datepicker_container,
  };

  const [selectedDay, setSelectedDay] = useState(date ? new Date(date) : new Date());
  const [month, setMonth] = useState(date ? new Date(selectedDay) : new Date());

  const handleMonthChange = (type: string) => {
    type === "next" ? setMonth(new Date(dayjs(month).add(1, "month").format("YYYY-MM-DD"))) : setMonth(new Date(dayjs(month).add(-1, "month").format("YYYY-MM-DD")));
  };

  // selecting date
  function handleSelect(value: any) {
    onSelect(value);
    setSelectedDay(value);
    setSelected(value);
  }

  const [selected, setSelected] = useState<Date>();
  const defaultClassNames = getDefaultClassNames();
  return (
    <>
      {/* <style>{`.custom-head { color: red }`}</style> */}
      <div className={`${styles.container} select-none`}>
        {/* <DayPicker
                    mode="single"
                    classNames={classNames}
                    components={{
                        Caption: () => (
                            <div className={styles.caption}>
                                <span onClick={() => handleMonthChange("prev")}>
                                    <IconLeft />
                                </span>
                                <CaptionLabel displayMonth={month} />
                                <span onClick={() => handleMonthChange("next")}>
                                    <IconRight />
                                </span>
                            </div>
                        ),
                    }}
                    locale={ja}
                    weekStartsOn={1}
                    onSelect={(value) => handleSelect(value)}
                    month={month}
                    onMonthChange={() => alert()}
                    formatters={{ formatCaption }}
                    showOutsideDays
                    fixedWeeks
                    fromDate={props.fromDate}
                    toDate={props.toDate}
                    fromYear={props.fromYear}
                    toYear={props.toYear}
                /> */}
        <DayPicker
          animate
          mode="single" required
          selected={selected}
          onSelect={handleSelect}
          captionLayout="dropdown"
          //   footer={
          //     selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
          //   }
          // classNames={{
          //   navigation_button: styles.navButton,
          // }}
          // components={{
          //   Iconleft: () => <span className={styles.navButton}>‹</span>,
          //   IconRight: () => <span className={styles.navButton}>›</span>,
          // }}
        />
      </div>
    </>
  );
}

const formatCaption = (month: Date, options: any) => {
  return <>{format(month, "yyyy年 L月", { locale: options?.locale })}</>;
};
