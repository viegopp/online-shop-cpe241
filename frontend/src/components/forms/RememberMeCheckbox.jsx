const RememberMeCheckbox = ({ checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-slate-200 border-slate-200 rounded focus:ring-slate-500"
      />
      <span className="text-sm text-slate-500">Remember me</span>
    </label>
  );
};

export default RememberMeCheckbox;
