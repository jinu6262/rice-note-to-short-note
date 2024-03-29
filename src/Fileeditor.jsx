import { useEffect, useState } from "react";

function Fileeditor(props) {
    const [noteLength, setNoteLength] = useState(1);
    const [newNote, setNewNote] = useState("");
    const [loding, setLoding] = useState(true);

    const shortNoteLength = Math.floor((7500 / props.bpm) * noteLength);
    const note = props.hitObjects.split("\r\n");

    useEffect(() => {
        setNewNote(
            note
                .map((item) => {
                    if (item.slice(item.lastIndexOf(",")) === ",0:0:0:0:") {
                        let newItem = item.replaceAt(item.length - 12, "128");

                        const pushNote = Number(
                            newItem.slice(
                                newItem.indexOf(",", newItem.indexOf(",") + 1) + 1,
                                newItem.indexOf(",", newItem.indexOf(",", newItem.indexOf(",") + 1) + 1)
                            )
                        );

                        newItem = newItem.slice(0, newItem.length - 8) + (pushNote + shortNoteLength) + ":" + newItem.slice(newItem.length - 8);

                        return newItem;
                    }
                    return item;
                })
                .join("\r\n")
        );
        setLoding(false);
    }, [noteLength, shortNoteLength, note]);

    String.prototype.replaceAt = function (index, replacement) {
        if (index >= this.length) {
            return this.valueOf();
        }

        return this.substring(0, index) + replacement + this.substring(index + 1);
    };

    const onChangeHandler = (e) => {
        if (Number(e.target.value) !== noteLength) {
            setLoding(true);
            setNoteLength(Number(e.target.value));
        }
    };

    const mapInfo = new Blob([props.mapInfo + newNote], { type: "text/plain" });

    return (
        <>
            {loding ? (
                <div className="loding">loding...</div>
            ) : (
                <div>
                    <hr />
                    <p>변환 전</p>
                    <textarea name="before" id="before" cols="50" rows="15" defaultValue={props.hitObjects}></textarea>
                    <hr />
                    <p>
                        변환 후 - 숏롱길이 [{props.bpm}bpm 32bit] : {shortNoteLength}
                    </p>
                    <p>
                        <input
                            type="radio"
                            name="shortNoteLength"
                            id="32bit"
                            onChange={(e) => {
                                onChangeHandler(e);
                            }}
                            value={1}
                            checked={noteLength === 1}
                        />
                        <label htmlFor="32bit">32bit</label>

                        <input
                            type="radio"
                            name="shortNoteLength"
                            id="16bit"
                            onChange={(e) => {
                                onChangeHandler(e);
                            }}
                            value={2}
                            checked={noteLength === 2}
                        />
                        <label htmlFor="16bit">16bit</label>
                    </p>

                    <textarea name="after" id="after" cols="50" rows="15" defaultValue={newNote}></textarea>

                    <br />
                    <button variant="outlined">
                        <a
                            download={props.fileName}
                            target="_blank"
                            rel="noreferrer"
                            href={URL.createObjectURL(mapInfo)}
                            style={{
                                textDecoration: "inherit",
                                color: "inherit",
                            }}
                        >
                            비트맵 파일 다운로드
                        </a>
                    </button>
                </div>
            )}
        </>
    );
}

export default Fileeditor;
