import { useState } from "react";
import Fileeditor from "./Fileeditor";

function Filereader() {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [creator, setCreator] = useState("");
    const [bpm, setBpm] = useState(0);
    const [hitObjects, setHitObjects] = useState("");
    const [mapInfo, setMapInfo] = useState("");
    const [newName, setNewName] = useState("");
    const [file, setFile] = useState("");

    const onReadFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        if (!file) {
            setFile("");
            return;
        }

        reader.readAsText(file);

        reader.onload = (e) => {
            const fileContent = e.target.result;

            setNewName(file.name.slice(0, file.name.length - 4) + "(short long ver)" + file.name.slice(file.name.length - 4));

            setFile(fileContent);

            setTitle(
                fileContent.slice(
                    fileContent.indexOf("Title:", fileContent.indexOf("[Metadata]")),
                    fileContent.indexOf("TitleUnicode:", fileContent.indexOf("[Metadata]"))
                )
                // .slice(0, -1) + "[short long ver]"
            );
            setArtist(
                fileContent.slice(
                    fileContent.indexOf("Artist:", fileContent.indexOf("[Metadata]")),
                    fileContent.indexOf("ArtistUnicode:", fileContent.indexOf("[Metadata]"))
                )
            );
            setCreator(
                fileContent.slice(
                    fileContent.indexOf("Creator:", fileContent.indexOf("[Metadata]")),
                    fileContent.indexOf("Version:", fileContent.indexOf("[Metadata]"))
                )
            );

            setBpm(
                Math.round(
                    (60000 /
                        Number(
                            fileContent.slice(
                                fileContent.indexOf(",", fileContent.indexOf("[TimingPoints]")) + 1,
                                fileContent.indexOf(",", fileContent.indexOf(",", fileContent.indexOf("[TimingPoints]")) + 1)
                            )
                        )) *
                        100
                ) / 100
            );

            setHitObjects(fileContent.slice(fileContent.indexOf("[", fileContent.indexOf("[HitObjects]"))));

            setMapInfo(
                fileContent.slice(0, fileContent.indexOf("TitleUnicode:", fileContent.indexOf("[Metadata]")) - 2) +
                    "[short long ver]\n" +
                    fileContent.slice(fileContent.indexOf("TitleUnicode:"), fileContent.indexOf("[HitObjects]") - 1)
            );
        };
    };
    return (
        <div>
            <input type="file" onChange={onReadFile}></input>

            <hr />

            {file ? (
                <div>
                    <pre>{title}</pre>
                    <pre>{artist}</pre>
                    <pre>{creator}</pre>
                    <pre>bpm:{bpm}</pre>
                    <Fileeditor hitObjects={hitObjects} bpm={bpm} mapInfo={mapInfo} fileName={newName} />
                </div>
            ) : (
                <div>파일 없음</div>
            )}
        </div>
    );
}

export default Filereader;
