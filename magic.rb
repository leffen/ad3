require 'json'

class String
  def underscore
    self.gsub(/::/, '/').
        gsub(/([A-Z]+)([A-Z][a-z])/, '\1_\2').
        gsub(/([a-z\d])([A-Z])/, '\1_\2').
        tr("-", "_").
        downcase
  end
end

class ProcessInfo
  attr_accessor :asset_id, :duration, :duration_seconds, :process_duration, :process_duration_seconds, :process_seconds_per_clip_minute, :without_transcoding, :event_start, :event_end

  def initialize(attributes)
    attributes.each { |k, v| send("#{k.underscore}=", v) if respond_to?("#{k.underscore}=") }
  end
end

def report_data(file_name)
  data = File.read(file_name, :encoding => 'UTF-8')
  clip_data = JSON.parse(data).map { |e| ProcessInfo.new(e) }.sort { |a, b| a.process_seconds_per_clip_minute <=> b.process_seconds_per_clip_minute }
  data= clip_data.select { |e| e.process_duration_seconds>0 && !e.without_transcoding }
                  .sort { |a, b| a.duration_seconds<=>b.duration_seconds }
                  .map { |e| [e.duration_seconds, e.process_duration_seconds, e.asset_id] }
  data.to_json
end
