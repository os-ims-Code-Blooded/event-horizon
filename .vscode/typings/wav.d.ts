//https://stackoverflow.com/questions/59247861/how-to-import-a-sound-file-into-react-typescript-component
declare module '*.wav' {
  const value: string;
  export default value;
}
